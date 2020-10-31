
import Foo from "./foo";


interface State {
    computing: boolean;
    mem: WebAssembly.Memory|null;
    checkpoint: ArrayBuffer|null;
}

enum Checkpoint {No, Save};

class C {
    #boxy: HTMLElement;
    #reload_button: HTMLButtonElement;

    #state: State;
    
    constructor(boxy: HTMLElement, reload_button: HTMLButtonElement) {
        this.#boxy = boxy;
        this.#reload_button = reload_button;
        this.#state = {computing: false, mem: null, checkpoint: null};
        reload_button.addEventListener("click", (_event) => this.Refresh());
    }

    get state(): State { return this.#state; }

    static sleep = (timeout: number) => new Promise<void>((resolve) => window.setTimeout(resolve, timeout));

    static MemoryDescriptor = (prevBytes?:number): [WebAssembly.MemoryDescriptor, number] => {
        const WASM_PAGE_SIZE = 65536;
        const TOTAL_STACK = 5242880; // this seems hardcoded in Emscripten
        let initialMem = 10 + (TOTAL_STACK / WASM_PAGE_SIZE); // this should match c/Makefile
        const maximumMem = 2 * initialMem;
        if (prevBytes !== undefined && prevBytes / WASM_PAGE_SIZE > initialMem)
            initialMem = prevBytes / WASM_PAGE_SIZE;
        return [{initial: initialMem, maximum: maximumMem},  initialMem * WASM_PAGE_SIZE];
    }

    

    MakeModuleIn = <T extends Foo.InputModule>(t: T): T&Foo.ModulePrint => {
        const print = (...data: any[]) => {
            this.Put (C.StdoutBanner(), ...data, '\n');
        };
        
        const u = {...t, print: print};
        return u;
    }

    Compute = async (foo: Foo.Module & Foo.FooItf, checkpoint: Checkpoint) => {
        await this.WithComputing (async () => {
            foo._initialize();
            if (checkpoint === Checkpoint.Save)
                this.SaveCheckPoint ();
            for (let i = 0; i < 50; ++i) {
                await C.sleep (50);
                const n = foo._foo ();
                this.Put (`iter i = ${i} n = ${n}\n`);
            }
            this.Put (`\n\nmemory has ${this.state.mem!.buffer.byteLength} bytes\n`);
        }); 
    }

    WithComputing = async (f: () => Promise<void>) => {
        this.state.computing = true;
        this.#reload_button.disabled = true;
        await f();
        this.#reload_button.disabled = false;
        this.state.computing = false;
    }

    SaveCheckPoint = () => {
        const buffer = this.state.mem!.buffer;
        this.state.checkpoint = null; /* drop the old checkpoint, if any */
        const checkpoint = new ArrayBuffer(buffer.byteLength);
        C.CopyBuffer ({from: buffer, to: checkpoint});
        this.state.checkpoint = checkpoint;
    }
 
    static CopyBuffer(arg: {from: ArrayBuffer, to: ArrayBuffer}) {
        const src = new Uint8Array(arg.from);
        const dest = new Uint8Array(arg.to);
        dest.set(src);
    }

    /**
     * Initialize the WebAssembly instance for Emscripten module `Foo`
     * 
     * @param oldBuffer if it is not `undefined`, copy its contents over
     * the memory of the WASM instance after it is instantiated.
     *
     * The initial memory size is the maximum of the hardcoded initial size and
     * the actual size of `oldBuffer`.
     */
    Reinit = async (oldBuffer?: ArrayBuffer): Promise<Foo.Module & Foo.FooItf> => {
        this.state.mem = null;
        const [memoryDescriptor, initialMemory] = C.MemoryDescriptor(oldBuffer?.byteLength);
        const newMem = new WebAssembly.Memory(memoryDescriptor);
        const moduleIn = this.MakeModuleIn ({"wasmMemory": newMem, "INITIAL_MEMORY": initialMemory});
        this.state.mem = newMem;
        this.Put ("instantiating wasm module ...\n");
        const foo = await Foo (moduleIn);
        this.Put ("wasm module instantiation finished\n");
        if (oldBuffer !== undefined) {
            C.CopyBuffer({from: oldBuffer, to: newMem.buffer});
            this.Put ("snapshot copied to instance memory\n");
        }
        oldBuffer = undefined;
        return foo;
    }

    FirstRun = async () => {
        this.Put ('First run\n');
        const foo = await this.Reinit();
        await this.Compute(foo, Checkpoint.Save);
    }

    Refresh = async () => {
        if (this.state.computing)
            return;
        this.#boxy.innerHTML = "Restarted\n";
        const foo = await this.Reinit (this.state.checkpoint!);
        await this.Compute (foo, Checkpoint.No);
    }

    Put = (...content: (string | Node)[]) => {
        this.#boxy.append(...content);
    }

    static StdoutBanner = (): HTMLElement => {
        const e = document.createElement("span");
        e.classList.add("stdoutBanner");
        e.append("stdout⋙ ");
        return e;
    }

    _dumpObject = (foo: object, name?: string) => {
        name = (name === undefined) ? "foo" : name;
        this.Put (document.createElement("hr"));
        Object.keys(foo).forEach((k, _idx, _arr) => {
            this.Put (`${name}.${k}`, document.createElement("br"));
        })
    }
}

document.addEventListener('DOMContentLoaded', (_event) => {
    const c = new C(document.getElementById('boxy')!,
                    document.getElementById("reload")! as HTMLButtonElement);
    c.FirstRun().catch((e)=> console.log (`error: ${e}`));    
});
