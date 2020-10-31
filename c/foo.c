#include <stdlib.h>
#include <memory.h>
#include <stdio.h>
#include <emscripten.h>
#include "bar.h"

int *g;

EMSCRIPTEN_KEEPALIVE
void
initialize (void)
{
    if (g)
        printf ("g already set\n");
    else {
        printf ("allocated g\n");
        g = malloc (sizeof (int));
        memset (g, 0, sizeof(*g));
    }
}

EMSCRIPTEN_KEEPALIVE
int
foo (void)
{
    *g += get_bar ();
    return *g;
}
