import React from "react";
import { describe, expect, it } from "vitest";
import { Link, Outlet } from "react-router-dom";
import { useLocation, useParams } from "react-router";
import type { RouteObject } from "react-router-dom";
import { withRoute, withRouteTree, withRouter } from "./index.js";
import { useQueryParam, StringParam } from "use-query-params";
import { click, render } from "@homebound/rtl-utils";

describe("renderRouter", () => {
  it("withRouter provides expected defaults", async () => {
    // Given withRouter used without an explicit url
    // When component rendered
    const r = await render(<FooPage />, { wrappers: [withRouter()] });
    // Then url is root
    expect(r.url.innerHTML).toEqual("/");
  });

  it("withRouter renders without requiring a path", async () => {
    // Given withRouter provided an explicit url and is used without withRoute
    const router = withRouter(fooUrlWithParam);
    // When component is rendered
    const r = await render(<FooPage />, { wrappers: [router] });
    // Then url is correct
    expect(router.location.pathname).toBe(fooUrl);
    expect(r.url.innerHTML).toEqual(fooUrl);
    // and param is correct
    expect(r.param.innerHTML).toEqual("test");
    // and there is no match for `id` as we didn't specify withRoute
    expect(r.id.innerHTML).toEqual("");
  });

  it("withRoute throws when not wrapped by router", async () => {
    // Given route is not wrapped by router when the component is rendered then an error is thrown
    // withRoute("") is a pass-through; use a real path to require a Router parent
    await expect(render(<FooPage />, { wrappers: [withRoute(fooPath)] })).rejects.toThrow(
      "useRoutes() may be used only in the context of a <Router> component",
    );
  });

  it("withRoute provides expected defaults", async () => {
    // Given withRoute used without an explicit path
    // When component rendered
    const r = await render(<FooPage />, { wrappers: [withRoute(), withRouter()] });
    // Then route path is an empty string
    expect(r.id.innerHTML).toEqual("");
  });

  it("withRouter and withRoute supports useParams and useQueryParam hooks", async () => {
    // Given withRouter and withRoute are used to wrap component
    const router = withRouter(fooUrlWithParam);
    const route = withRoute(fooPath);
    // When component is rendered
    const r = await render(<FooPage />, { wrappers: [route, router] });
    // Then url is correct
    expect(router.location.pathname).toBe(fooUrl);
    expect(r.url.innerHTML).toEqual(fooUrl);
    // and param is correct
    expect(r.param.innerHTML).toEqual("test");
    // and there is a match for `id` as path was provided
    expect(r.id.innerHTML).toEqual("1");
  });

  it("navigates via router.navigate and updates location", async () => {
    const router = withRouter("/foo/1", "/foo/:id");
    await render(<FooPage />, { wrappers: [router] });
    expect(router.location.pathname).toBe("/foo/1");

    await router.navigate("/foo/2");

    expect(router.location.pathname).toBe("/foo/2");
  });

  it("navigates via Link click and updates location", async () => {
    const router = withRouter("/foo/1", "/foo/:id");
    const r = await render(
      <>
        <Link to="/foo/2">Go</Link>
        <FooPage />
      </>,
      { wrappers: [router] },
    );
    expect(router.location.pathname).toBe("/foo/1");

    click(r.getByRole("link", { name: /go/i }));

    expect(router.location.pathname).toBe("/foo/2");
  });
});

describe("withRouteTree", () => {
  it("matches nested route tree and renders the leaf", async () => {
    const r = await render(<></>, { wrappers: [withRouteTree(fooRoutes(), "/foo/1")] });
    expect(r.leaf.innerHTML).toEqual("leaf");
  });

  it("ignores the wrap child", async () => {
    const r = await render(<div data-testid="ignored" />, { wrappers: [withRouteTree(fooRoutes(), "/foo/1")] });
    expect(r.query.ignored).toBeNull();
    expect(r.leaf.innerHTML).toEqual("leaf");
  });

  it("location reflects the url arg", async () => {
    const router = withRouteTree(fooRoutes(), "/foo/2");
    await render(<></>, { wrappers: [router] });
    expect(router.location.pathname).toBe("/foo/2");
  });

  it("navigates via router.navigate and updates location", async () => {
    const router = withRouteTree(fooRoutes(), "/foo/1");
    await render(<></>, { wrappers: [router] });
    expect(router.location.pathname).toBe("/foo/1");

    await router.navigate("/foo/2");

    expect(router.location.pathname).toBe("/foo/2");
  });

  it("does not render a leaf for an unknown URL", async () => {
    const r = await render(<></>, { wrappers: [withRouteTree(fooRoutes(), "/foo/1/not-found")] });
    expect(r.query.leaf).toBeNull();
    expect(r.notFound.innerHTML).toEqual("not-found");
  });
});

const fooUrl = "/foo/1";
const fooPath = "/foo/:id";
const fooUrlWithParam = `${fooUrl}?param=test`;

type FooParams = { id: string };

function FooPage() {
  const { id } = useParams<FooParams>();
  const { pathname } = useLocation();
  const [param] = useQueryParam("param", StringParam);
  return (
    <>
      <span data-testid="id">{id ?? ""}</span>
      <span data-testid="url">{pathname}</span>
      <span data-testid="param">{param}</span>
    </>
  );
}

function fooRoutes(): RouteObject[] {
  return [
    {
      path: "/foo",
      element: <Outlet />,
      children: [
        { path: ":id", element: <span data-testid="leaf">leaf</span> },
        { path: "*", element: <span data-testid="notFound">not-found</span> },
      ],
    },
  ];
}
