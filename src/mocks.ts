import { History, Location } from "history";

export function newLocation(path: string, search: string = ""): Location {
  return {
    pathname: path,
    search,
    hash: "",
    state: {},
  };
}

export function newHistoryMock(location?: Location): History {
  return {
    length: history.length,
    go: history.go,
    action: "PUSH",
    goBack: history.back,
    goForward: history.forward,
    replace: jest.fn(),
    createHref: jest.fn(),
    block: jest.fn(),
    push: jest.fn(),
    location: location ?? newLocation("/"),
    listen: jest.fn(),
  };
}
