import React from "react";
import { useParams, useRouteMatch } from "react-router";
import { withRouter } from "./index";
import { useQueryParam, StringParam } from "use-query-params";
import { render } from "@testing-library/react";

describe("renderRouter", () => {
  it("withRouter supports useParams, useRouteMatch, and useQueryParam hooks", async () => {
    const router = withRouter(fooUrlWithParam, fooPath);
    const { getByTestId } = render(router.wrap(<FooPage />));
    expect(router.history.location.pathname).toBe(fooUrl);
    expect(getByTestId("id").innerHTML).toEqual("1");
    expect(getByTestId("url").innerHTML).toEqual(fooUrl);
    expect(getByTestId("param").innerHTML).toEqual("test");
  });

  it("withRouter renders without requiring a path", async () => {
    const { getByTestId } = render(withRouter(fooUrlWithParam).wrap(<FooPage />));
    expect(getByTestId("url").innerHTML).toEqual("/");
    expect(getByTestId("param").innerHTML).toEqual("test");
    // Cannot match `id` as we didn't specify a `path` for matching against
    expect(getByTestId("id").innerHTML).toEqual("");
  });

  it("withRouter provides expected defaults", async () => {
    const { getByTestId } = await render(withRouter().wrap(<FooPage />));
    expect(getByTestId("url").innerHTML).toEqual("/");
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
