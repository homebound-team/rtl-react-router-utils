import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router";
import { withRoute, withRouter } from "./index.js";
import { useQueryParam, StringParam } from "use-query-params";
import { act, fireEvent, render, screen } from "@testing-library/react";

describe("renderRouter", () => {
  it("withRouter provides expected defaults", () => {
    // Given withRouter used without an explicit url
    // When component rendered
    const { getByTestId } = render(withRouter().wrap(<FooPage />));
    // Then url is root
    expect(getByTestId("url").innerHTML).toEqual("/");
  });

  it("withRouter renders without requiring a path", () => {
    // Given withRouter provided an explicit url and is used without withRoute
    const router = withRouter(fooUrlWithParam);
    // When component is rendered
    const { getByTestId } = render(router.wrap(<FooPage />));
    // Then url is correct
    expect(router.location.pathname).toBe(fooUrl);
    expect(getByTestId("url").innerHTML).toEqual(fooUrl);
    // and param is correct
    expect(getByTestId("param").innerHTML).toEqual("test");
    // and there is no match for `id` as we didn't specify withRoute
    expect(getByTestId("id").innerHTML).toEqual("");
  });

  it("withRoute throws when not wrapped by router", () => {
    // note: test passes but still showing asserted error in console without spy
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });
    // Given route is not wrapped by router when the component is rendered then an error is thrown
    // withRoute("") is a pass-through; use a real path to require a Router parent
    expect(() => render(withRoute(fooPath).wrap(<FooPage />))).toThrow(
      "useRoutes() may be used only in the context of a <Router> component",
    );
    spy.mockRestore();
  });

  it("withRoute provides expected defaults", () => {
    // Given withRoute used without an explicit path
    // When component rendered
    const { getByTestId } = render(withRouter().wrap(withRoute().wrap(<FooPage />)));
    // Then route path is an empty string
    expect(getByTestId("id").innerHTML).toEqual("");
  });

  it("withRouter and withRoute supports useParams and useQueryParam hooks", () => {
    // Given withRouter and withRoute are used to wrap component
    const router = withRouter(fooUrlWithParam);
    const route = withRoute(fooPath);
    // When component is rendered
    const { getByTestId } = render(router.wrap(route.wrap(<FooPage />)));
    // Then url is correct
    expect(router.location.pathname).toBe(fooUrl);
    expect(getByTestId("url").innerHTML).toEqual(fooUrl);
    // and param is correct
    expect(getByTestId("param").innerHTML).toEqual("test");
    // and there is a match for `id` as path was provided
    expect(getByTestId("id").innerHTML).toEqual("1");
  });

  it("navigates via router.navigate and updates location", async () => {
    const router = withRouter("/foo/1", "/foo/:id");
    render(router.wrap(<FooPage />));
    expect(router.location.pathname).toBe("/foo/1");

    await router.navigate("/foo/2");

    expect(router.location.pathname).toBe("/foo/2");
  });

  it("navigates via Link click and updates location", async () => {
    const router = withRouter("/foo/1", "/foo/:id");
    render(
      router.wrap(
        <>
          <Link to="/foo/2">Go</Link>
          <FooPage />
        </>,
      ),
    );
    expect(router.location.pathname).toBe("/foo/1");

    fireEvent.click(screen.getByRole("link", { name: /go/i }));

    expect(router.location.pathname).toBe("/foo/2");
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
