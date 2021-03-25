
# rtl-react-router-utils

A `withRouter` helper for using with `rtl-utils`.

```tsx
import { withRouter } from "@homebound/rtl-react-router-utils";

const router = withRouter("/currentPage", "/:path");
const { button } = await render(
  <FooPage />,
  router);
click(button);
expect(router.history.location.pathname).toEqual("/somethingElse");
```

foo
