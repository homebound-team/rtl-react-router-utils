# rtl-react-router-utils

Test helpers for React Router v6, designed to compose with `rtl-utils` `render()`.

```tsx
import { click, render } from "@homebound/rtl-utils";
import { withRouter } from "@homebound/rtl-react-router-utils";

const router = withRouter("/currentPage");
const r = await render(<FooPage />, { wrappers: [router] });
click(r.button);
expect(router.location.pathname).toEqual("/somethingElse");
```

Imperative navigation (replaces `router.history.push`):

```tsx
await router.navigate("/somethingElse");
expect(router.location.pathname).toEqual("/somethingElse");
```

A `withRoute` helper for using with `rtl-utils`.

```tsx
import { click, render } from "@homebound/rtl-utils";
import { withRoute, withRouter } from "@homebound/rtl-react-router-utils";

const router = withRouter("/currentPage");
const route = withRoute("/:path");
const r = await render(<FooPage />, { wrappers: [route, router] });
click(r.button);
expect(router.location.pathname).toEqual("/somethingElse");
```

## `withRoutes` — route smoke tests

Use when mounting a **`RouteObject`** from the root. RR6 matches the URL and renders the matched route element — you do not pass the page component yourself.

```tsx
import { render } from "@homebound/rtl-utils";
import type { RouteObject } from "react-router-dom";
import { withRoutes } from "@homebound/rtl-react-router-utils";
import { librariesProductOfferingsRoute } from "src/routing/libraries";

const editUrl = "/libraries/product-offerings/edit/rp:1/rpav:1";
const routeTree = withRoutes([librariesProductOfferingsRoute], editUrl);

// `<></>` is a placeholder — render() still takes a component first arg, but it is ignored
const r = await render(<></>, { wrappers: [routeTree] });
expect(r.saveOptions).toBeInTheDocument();
expect(routeTree.location.pathname).toBe(editUrl);
```
