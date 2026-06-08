import type { ReactElement } from "react";
import type { Location } from "react-router";
import type { Router } from "@remix-run/router";
import { Route, Routes, createMemoryRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

interface Wrapper {
  wrap(c: ReactElement): ReactElement;
}

type MemoryRouterHelper = Wrapper & {
  get location(): Location;
  get memoryRouter(): Router;
  navigate(to: string): Promise<void>;
};

/**
 * Applies Router and QueryParamProvider wrappers.
 *
 * I.e. `url` is a specific `/books/b:1`
 */
export function withRouter(url: string = "/", route: string = ""): MemoryRouterHelper {
  return createMemoryRouterHelper((c) => {
    const element = <QueryParamProvider adapter={ReactRouter6Adapter}>{c}</QueryParamProvider>;
    return createMemoryRouter(route ? [{ path: route, element }] : [{ path: "*", element }], {
      initialEntries: [url],
    });
  });
}

/**
 * Mounts a RouteObject tree via createMemoryRouter. The wrap child is ignored —
 * RR6 matches `url` against the tree and renders the matched route element.
 *
 * Does not inject QueryParamProvider; route-tree shells (e.g. AppShell) provide that.
 */
export function withRoutes(routes: RouteObject[], url: string = "/"): MemoryRouterHelper {
  return createMemoryRouterHelper(() => createMemoryRouter(routes, { initialEntries: [url] }));
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

function createMemoryRouterHelper(createRouter: (c: ReactElement) => Router): MemoryRouterHelper {
  let memoryRouter: Router | undefined;

  return {
    wrap(c) {
      memoryRouter = createRouter(c);
      return <RouterProvider router={memoryRouter} />;
    },
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

function requireMemoryRouter(memoryRouter: Router | undefined): Router {
  if (!memoryRouter) {
    throw new Error("Component must first be rendered before accessing location or memoryRouter");
  }
  return memoryRouter;
}
