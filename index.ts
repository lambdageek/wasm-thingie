

class C {
    #boxy: HTMLElement;
    
    constructor(boxy: HTMLElement) {
        this.#boxy = boxy;
    }

    static sleep = (timeout: number) => new Promise<void>((resolve) => window.setTimeout(resolve, timeout));

    Foo = async () => {
        this.Put ('abcd');
        for (let i = 0; i < 10; ++i) {
            await C.sleep (50);
            this.Put (document.createElement('br'), 'hijk');
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
