
import Foo from "./foo";


class C {
    #boxy: HTMLElement;
    
    constructor(boxy: HTMLElement) {
        this.#boxy = boxy;
    }

    static sleep = (timeout: number) => new Promise<void>((resolve) => window.setTimeout(resolve, timeout));

    Foo = async () => {
        this.Put ('abcd');
        const WASM_PAGE_SIZE = 65536;
        const TOTAL_STACK = 5242880; // this seems hardcoded in Emscripten
        const initialMem = 10 + (TOTAL_STACK / WASM_PAGE_SIZE); // this should match c/Makefile
        let mem = new WebAssembly.Memory ({initial: initialMem, maximum: 2*initialMem});
        let moduleIn = {"wasmMemory": mem, "INITIAL_MEMORY": initialMem * WASM_PAGE_SIZE};
        let foo = await Foo (moduleIn);
        foo._initialize();
        for (let i = 0; i < 10; ++i) {
            await C.sleep (50);
            let n = foo._foo ();
            this.Put (document.createElement('br'), 'hijk ' + n);
        }
        //this._dumpObject(foo, "foo");
        this.Put (document.createElement("hr"));
        this.Put (`memory has ${mem.buffer.byteLength} bytes`);
    }

    Put = (...content: (string | Node)[]) => {
        this.#boxy.append(...content);
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
    var c = new C(document.getElementById('boxy')!);
    c.Foo().catch((e)=> console.log (`error: ${e}`));    
});
