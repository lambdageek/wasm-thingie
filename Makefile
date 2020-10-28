
.PHONY: all


all: dist/index.html

PARCELED_SOURCES= \
	foo.d.ts \
	index.ts \
	style.css \
	tsconfig.json \
	package.json \
	package-lock.json

C_SOURCES= \
	c/foo.c \
	c/bar.h \
	c/bar.cxx \
	c/Makefile \
	Makefile


GENERATED= \
	foo.js \
	foo.wasm

ROOTS= \
	index.html \
	foo.wasm

dist/index.html: $(PARCELED_SOURCES) $(GENERATED)
	parcel build $(ROOTS)

run: dist/index.html 
	parcel serves $(ROOTS)

foo.js foo.wasm: $(C_SOURCES)
	make -C c

clean:
	make -C c clean
	-rm -rf dist

distclean: clean
	-rm -rf node_modules
