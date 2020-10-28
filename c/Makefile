.PHONY: all clean

all: ../foo.wasm

SOURCES:= \
	foo.c \
	bar.h \
	bar.cxx

OBJ_SOURCES:= $(filter-out %.h,$(SOURCES))

INITIAL_MEMORY_PAGES= 90
INITIAL_MEMORY:=$(shell expr 64 \* $(INITIAL_MEMORY_PAGES))
INITIAL_MEMORY_UNIT=kb

../foo.js ../foo.wasm: $(SOURCES) Makefile
	emcc -o ../foo.js -s MODULARIZE=1 -s INITIAL_MEMORY=$(INITIAL_MEMORY)$(INITIAL_MEMORY_UNIT) -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS='["_initialize", "_foo"]' $(OBJ_SOURCES)

clean:
	-rm -f ../foo.js ../foo.wasm
