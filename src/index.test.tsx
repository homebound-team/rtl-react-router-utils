import React from "react";
import { useParams, useRouteMatch } from "react-router";
import { withRoute, withRouter } from "./index";
import { useQueryParam, StringParam } from "use-query-params";
import { render } from "@testing-library/react";

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
    expect(router.history.location.pathname).toBe(fooUrl);
    expect(getByTestId("url").innerHTML).toEqual("/");
    // and param is correct
    expect(getByTestId("param").innerHTML).toEqual("test");
    // and there is no match for `id` as we didn't specify withRoute
    expect(getByTestId("id").innerHTML).toEqual("");
  });

  it("withRoute throws when not wrapped by router", async () => {
    // note: test passes but still showing asserted error in console without spy
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    // Given route is not wrapped by router when the component is rendered then an error is thrown
    await expect(async () => render(withRoute().wrap(<FooPage />))).rejects.toThrowError(
      "Invariant failed: You should not use <Route> outside a <Router>",
    );
    spy.mockClear();
  });

  it("withRoute provides expected defaults", () => {
    // Given withRoute used without an explicit path
    // When component rendered
    const { getByTestId } = render(withRouter().wrap(withRoute().wrap(<FooPage />)));
    // Then route path is an empty string
    expect(getByTestId("id").innerHTML).toEqual("");
  });

  it("withRouter and withRoute supports useParams, useRouteMatch, and useQueryParam hooks", () => {
    // Given withRouter and withRoute are used to wrap component
    const router = withRouter(fooUrlWithParam);
    const route = withRoute(fooPath);
    // When component is rendered
    const { getByTestId } = render(router.wrap(route.wrap(<FooPage />)));
    // Then url is correct
    expect(router.history.location.pathname).toBe(fooUrl);
    expect(getByTestId("url").innerHTML).toEqual(fooUrl);
    // and param is correct
    expect(getByTestId("param").innerHTML).toEqual("test");
    // and there is a match for `id` as path was provided
    expect(getByTestId("id").innerHTML).toEqual("1");
  });
});

const fooUrl = "/foo/1";
const fooPath = "/foo/:id";
const fooUrlWithParam = `${fooUrl}?param=test`;

type FooParams = { id: string };

function FooPage() {
  const { id } = useParams<FooParams>();
  const { url } = useRouteMatch();
  const [param] = useQueryParam("param", StringParam);
  return (
    <>
      <span data-testid="id">{id}</span>
      <span data-testid="url">{url}</span>
      <span data-testid="param">{param}</span>
    </>
  );
}
