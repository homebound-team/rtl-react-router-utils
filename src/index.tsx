import React, { ReactElement } from "react";
import { MemoryHistory, createMemoryHistory } from "history";
import { Route, Router } from "react-router";
import { QueryParamProvider } from "use-query-params";
export * from "./mocks";

/** Interface for adding wrappers (i.e. store, theme, etc. providers) around the test component. */
export interface Wrapper {
  wrap(c: ReactElement): ReactElement;
}

/**
 * Applies Router, Route, and QueryParamProvider wrapper
 *
 * Defaults to an index route ("/").
 */
export function withRouter(url: string = "/", path?: string): Wrapper & { history: MemoryHistory } {
  const history = createMemoryHistory({ initialEntries: [url] });
  // If `path` was not provided, then default the path to the `url`'s pathname in order to have the <Route> component match.
  path = path ?? history.location.pathname;
  return {
    history,
    wrap: (c) => (
      <Router history={history}>
        <Route path={path}>
          <QueryParamProvider ReactRouterRoute={Route}>{c}</QueryParamProvider>
        </Route>
      </Router>
    ),
  };
}
