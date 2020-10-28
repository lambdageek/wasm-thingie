#include <memory>
#include "bar.h"

namespace {

  class H {
  public:
    explicit H () : p(std::make_unique<int>(0)) {}
    ~H () = default;
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
  return glb.barter();
}
