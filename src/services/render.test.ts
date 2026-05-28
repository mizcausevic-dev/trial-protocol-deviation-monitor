import { describe, expect, test } from "vitest";

import { renderDocs, renderOverview } from "./render.js";

describe("render surfaces", () => {
  test("overview carries the new trial title", () => {
    expect(renderOverview()).toContain("Trial Protocol Deviation Monitor");
    expect(renderOverview()).toContain("/protocol-lane");
  });

  test("docs route exposes the CLI and API shape", () => {
    const html = renderDocs();
    expect(html).toContain("protocol-deviation-monitor");
    expect(html).toContain("/api/deviation-routing");
  });
});
