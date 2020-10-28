
export = Module;

declare function Module<Inp extends Module.InputModule>(inputModule?: Inp): Promise<Inp&Module.FooItf&Module.Module>;

declare namespace Module {

    /// Properties that can be set to affect the emscripten wasm module
    export interface InputModule {
        INITIAL_MEMORY?: number;
        wasmMemory?: WebAssembly.Memory;
    }

    export interface Module {
        HEAP8: Int8Array;
        HEAP16: Int16Array;
        HEAP32: Int32Array;
        HEAPU8: Uint8Array;
        HEAPU16: Uint16Array;
        HEAPU32: Uint32Array;
    }

    export interface FooItf {
        _initialize (): void;
        _foo (): number;
    }

}
