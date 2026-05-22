# rtl-react-router-utils

A `withRouter` helper for using with `rtl-utils`.

```tsx
import { withRouter } from "@homebound/rtl-react-router-utils";

const router = withRouter("/currentPage");
const { button } = await render(<FooPage />, router);
click(button);
expect(router.location.pathname).toEqual("/somethingElse");
```

Imperative navigation (replaces `router.history.push`):

```tsx
await router.memoryRouter.navigate("/somethingElse");
expect(router.location.pathname).toEqual("/somethingElse");
```

`navigate` returns a `Promise` — use `await` in tests (often inside `act(async () => { ... })`).

A `withRoute` helper for using with `rtl-utils`.

```tsx
import { withRoute, withRouter } from "@homebound/rtl-react-router-utils";

const router = withRouter("/currentPage");
const route = withRoute("/:path");
const { button } = await render(<FooPage />, route, router);
click(button);
expect(router.location.pathname).toEqual("/somethingElse");
```
