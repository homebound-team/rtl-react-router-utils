import React from "react";
import type { ReactElement } from "react";
import { MemoryHistory, createMemoryHistory } from "history";
import { Route, Router, useHistory, useLocation } from "react-router";
import { QueryParamProvider } from "use-query-params";
import type { QueryParamAdapterComponent } from "use-query-params";
export * from "./mocks.js";

interface Wrapper {
  wrap(c: ReactElement): ReactElement;
}

// `use-query-params` v2 removed the older `ReactRouterRoute` prop API and now
// expects an adapter component, so we provide the minimal React Router v5 bridge here.
const ReactRouter5Adapter: QueryParamAdapterComponent = ({ children }) => {
  const history = useHistory();
  const location = useLocation();

  return children({
    location,
    push(nextLocation) {
      history.push(nextLocation.search || "?", nextLocation.state);
    },
    replace(nextLocation) {
      history.replace(nextLocation.search || "?", nextLocation.state);
    },
  });
};

/**
 * Applies Router and QueryParamProvider wrappers.
 *
 * I.e. `url` is a specific `/books/b:1`
 */
export function withRouter(url: string = "/"): Wrapper & { history: MemoryHistory } {
  const history = createMemoryHistory({ initialEntries: [url] });
  const wrap: Wrapper["wrap"] = (c) => (
    <Router history={history}>
      <QueryParamProvider adapter={ReactRouter5Adapter}>{c}</QueryParamProvider>
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
