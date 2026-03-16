import { History, Location } from "history";
import { vi } from "vitest";

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
    replace: vi.fn(),
    createHref: vi.fn(),
    block: vi.fn(),
    push: vi.fn(),
    location: location ?? newLocation("/"),
    listen: vi.fn(),
  };
}
