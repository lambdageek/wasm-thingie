
export = Module;

declare function Module(): Promise<Module.FooItf>;

declare namespace Module {

    export interface FooItf {
        _initialize (): void;
        _foo (): number;
    }
}