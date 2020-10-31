#include <memory>
#include <cstdio>
#include "bar.h"

namespace {

  class H {
  public:
    explicit H () : p(std::make_unique<int>(0)) {
      std::printf("constructor ran\n");
    }
    ~H () {
      std::printf("destructor ran\n");
    };
    H (H&&) = default;
    H (const H& other) : p(std::make_unique<int>(*other.p)) {}
    H& operator= (const H& other) {
      if (&other == this)
              return *this;
      *p = *other.p;
      return *this;
    }
    H& operator= (H&&) = default;

    int barter() {
      std::printf("barter: &p = %p, *p = %d\n", &p, *p);
      return (*p)++;
    }

  private:
    std::unique_ptr<int> p;
  };

  // global
  H glb{}; // this should make __wasm_call_ctors do some work

} // namespace <annonymous>

int
get_bar (void)
{
  int bartered = glb.barter();
  std::printf("bartered %d\n", bartered);
  return bartered;
}
