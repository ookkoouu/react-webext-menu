import React, { useState } from "react";
import { describe, expect, test } from "vitest";
import { Checkbox, Normal, Radio, Separator, render } from "../src/index";
import { createBrowserMock } from "./mock";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("Elements", () => {
  const { mock } = createBrowserMock();
  test("Normal", () => {
    expect(() => render(<Normal title="foo" />, mock)).not.toThrow();
  });
  test("Checkbox", () => {
    expect(() => render(<Checkbox title="foo" />, mock)).not.toThrow();
  });
  test("Radio", () => {
    expect(() => render(<Radio title="foo" />, mock)).not.toThrow();
  });
  test("Separator", () => {});
});

describe("Counter Example", () => {
  const { mock, click, menus } = createBrowserMock();

  function App() {
    const [count, setCount] = useState(0);
    return (
      <Normal title="Counter Example">
        <Normal
          id="button"
          title={count.toString()}
          onClick={() => setCount((i) => i + 1)}
        />
        <Separator />
        <Normal title="Reset" onClick={() => setCount(0)} />
      </Normal>
    );
  }

  test("render", async () => {
    await render(<App />, mock);
    await sleep(100);
    expect(menus.size).toBe(4);
    expect(menus.get("button")).toBeTruthy();
  });

  test("click", async () => {
    let label = menus.get("button")?.title;
    expect(label).toBe("0");
    click("button");
    await sleep(100);
    label = menus.get("button")?.title;
    expect(label).toBe("1");
  });
});
