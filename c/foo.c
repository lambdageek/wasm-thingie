#include <stdlib.h>
#include <memory.h>
#include <emscripten.h>
int *g;

EMSCRIPTEN_KEEPALIVE
void
initialize (void)
{
    g = malloc (sizeof (int));
    memset (g, 0, sizeof(*g));
}

EMSCRIPTEN_KEEPALIVE
int
foo (void)
{
    *g += 1;
    return *g;
}