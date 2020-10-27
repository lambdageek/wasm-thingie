.PHONY: all clean

all: ../foo.wasm


../foo.js ../foo.wasm: foo.c
	emcc -o ../foo.js -s MODULARIZE=1 -s EXPORTED_FUNCTIONS='["_initialize", "_foo"]' $<

clean:
	-rm -f ../foo.js ../foo.wasm
