.PHONY: all clean

all: ../foo.wasm

SOURCES:= \
	foo.c \
	bar.h \
	bar.cxx

OBJ_SOURCES:= $(filter-out %.h,$(SOURCES))

../foo.js ../foo.wasm: $(SOURCES)
	emcc -o ../foo.js -s MODULARIZE=1 -s EXPORTED_FUNCTIONS='["_initialize", "_foo"]' $(OBJ_SOURCES)

clean:
	-rm -f ../foo.js ../foo.wasm
