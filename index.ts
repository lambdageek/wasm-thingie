
import Foo from "./foo";


class C {
    #boxy: HTMLElement;
    
    constructor(boxy: HTMLElement) {
        this.#boxy = boxy;
    }

    static sleep = (timeout: number) => new Promise<void>((resolve) => window.setTimeout(resolve, timeout));

    Foo = async () => {
        this.Put ('abcd');
        let foo  = await Foo ();
        foo._initialize();
        for (let i = 0; i < 10; ++i) {
            await C.sleep (50);
            let n = foo._foo ();
            this.Put (document.createElement('br'), 'hijk ' + n);
        }
    }

    Put = (...content: (string | Node)[]) => {
        this.#boxy.append(...content);
   }
}

document.addEventListener('DOMContentLoaded', (_event) => {
    var c = new C(document.getElementById('boxy')!);
    c.Foo().catch((e)=> console.log (`error: ${e}`));    
});
