import type { Menus } from "webextension-polyfill";
import Browser from "webextension-polyfill";
import { reconciler } from "./reconciler";

export interface RenderOptions {
  contexts?: Menus.ContextType[];
  documentUrlPatterns?: string[];
  targetUrlPatterns?: string[];
}

export const render = (node: React.ReactNode) => {
  if (Browser.contextMenus === undefined) {
    throw new Error(`Permission "contextMenus" required.`);
  }
  const root = reconciler.createContainer(
    [],
    0,
    null,
    false,
    null,
    "",
    (err) => console.log("onRecoverableError:", err),
    null,
  );
  reconciler.updateContainer(node, root);
};
