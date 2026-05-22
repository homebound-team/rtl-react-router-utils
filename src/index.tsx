import type { ReactElement } from "react";
import type { Location } from "react-router";
import type { Router } from "@remix-run/router";
import { Route, Routes, createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

interface Wrapper {
  wrap(c: ReactElement): ReactElement;
}

/**
 * Applies Router and QueryParamProvider wrappers.
 *
 * I.e. `url` is a specific `/books/b:1`
 */
export function withRouter(
  url: string = "/",
  route: string = "",
): Wrapper & {
  get location(): Location;
  get memoryRouter(): Router;
  navigate(to: string): Promise<void>;
} {
  let memoryRouter: Router | undefined;

  const wrap: Wrapper["wrap"] = (c) => {
    const element = <QueryParamProvider adapter={ReactRouter6Adapter}>{c}</QueryParamProvider>;
    memoryRouter = createMemoryRouter(
      route ? [{ path: route, element }] : [{ path: "*", element }],
      { initialEntries: [url] },
    );
    return <RouterProvider router={memoryRouter} />;
  };

  return {
    wrap,
    get location() {
      return requireMemoryRouter(memoryRouter).state.location;
    },
    get memoryRouter() {
      return requireMemoryRouter(memoryRouter);
    },
    navigate(to: string) {
      return requireMemoryRouter(memoryRouter).navigate(to);
    },
  };
}

/**
 * Applies Route wrapper inside an existing Router (prefer `withRouter(url, route)` instead).
 */
export function withRoute(route: string = ""): Wrapper {
  const wrap: Wrapper["wrap"] = (c) =>
    route ? (
      <Routes>
        <Route path={route} element={c} />
      </Routes>
    ) : (
      c
    );
  return { wrap };
}

function requireMemoryRouter(memoryRouter: Router | undefined): Router {
  if (!memoryRouter) {
    throw new Error("Component must first be rendered before accessing location or memoryRouter");
  }
  return memoryRouter;
}
