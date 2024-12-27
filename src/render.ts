import type { Menus } from "webextension-polyfill";
import { reconciler } from "./reconciler";
import type { MenuApi } from "./types";

function apiPermitted(api: MenuApi): boolean {
  return [api?.create, api?.onClicked, api?.remove, api?.update].every(
    (e) => e != null,
  );
}

export interface RenderOptions {
  contexts?: Menus.ContextType[];
  documentUrlPatterns?: string[];
  targetUrlPatterns?: string[];
}

export const render = (
  node: React.ReactNode,
  api: MenuApi,
  opts: RenderOptions = {},
) => {
  if (!apiPermitted(api)) {
    throw new Error(`Permission "contextMenus" required.`);
  }

  const root = reconciler.createContainer(
    {
      api,
      overrideProps: {
        contexts: opts.contexts,
        documentUrlPatterns: opts.documentUrlPatterns,
        targetUrlPatterns: opts.targetUrlPatterns,
      },
      children: [],
    },
    0,
    null,
    false,
    null,
    "",
    (err) => console.trace("onRecoverableError:", err),
    null,
  );
  reconciler.updateContainer(node, root);
};
