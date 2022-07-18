import React, { ReactElement } from "react";
import { MemoryHistory, createMemoryHistory } from "history";
import { Route, Router } from "react-router";
import { QueryParamProvider } from "use-query-params";
export * from "./mocks";

interface Wrapper {
  wrap(c: ReactElement): ReactElement;
}

/**
 * Applies Router and QueryParamProvider wrappers.
 *
 * I.e. `url` is a specific `/books/b:1`
 */
export function withRouter(url: string = "/"): Wrapper & { history: MemoryHistory } {
  const history = createMemoryHistory({ initialEntries: [url] });
  const wrap: Wrapper["wrap"] = (c) => (
    <Router history={history}>
      <QueryParamProvider ReactRouterRoute={Route}>{c}</QueryParamProvider>
    </Router>
  );
  return { history, wrap };
}

/**
 * Applies Route wrapper.
 *
 * I.e. `route` is the pattern like `/books/:id`
 */
export function withRoute(route: string = ""): Wrapper {
  const wrap: Wrapper["wrap"] = (c) => <Route path={route}>{c}</Route>;
  return { wrap };
}
