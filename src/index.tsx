import React, { ReactElement } from "react";
import { MemoryHistory, createMemoryHistory } from "history";
import { Route, Router } from "react-router";
import { QueryParamProvider } from "use-query-params";
export * from "./mocks";

interface Wrapper {
  wrap(c: ReactElement): ReactElement;
}

/**
 * Applies Router, Route (if `route` is provided), and QueryParamProvider wrappers.
 *
 * I.e. `route` is the pattern like `/books/:id` and `url` is a specific `/books/b:1`.
 */
export function withRouter(url: string = "/", route?: string): Wrapper & { history: MemoryHistory } {
  const history = createMemoryHistory({ initialEntries: [url] });

  // If the user passes `route`, wrap in a `Route` so that the matched params
  // get auto-added to their props. Otherwise, don't add a `Route` because it
  // can mess up tests that are specifically testing `Route` behavior.
  const wrap: Wrapper["wrap"] = route
    ? (c) => (
        <Router history={history}>
          <Route path={route}>
            <QueryParamProvider ReactRouterRoute={Route}>{c}</QueryParamProvider>
          </Route>
        </Router>
      )
    : (c) => (
        <Router history={history}>
          <QueryParamProvider ReactRouterRoute={Route}>{c}</QueryParamProvider>
        </Router>
      );

  return { history, wrap };
}
