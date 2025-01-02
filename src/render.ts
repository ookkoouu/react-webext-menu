import type { FiberRoot } from "react-reconciler";
import { ConcurrentRoot } from "react-reconciler/constants";
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

export function render(
  node: React.ReactNode,
  api: MenuApi,
  opts: RenderOptions = {},
): Promise<FiberRoot> {
  return new Promise((resolve, reject) => {
    if (!apiPermitted(api)) {
      reject(`Permission "contextMenus" required.`);
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
      ConcurrentRoot,
      null,
      false,
      null,
      "",
      console.error,
      null,
    );

    reconciler.updateContainer(node, root, null, () => {
      resolve(root);
    });
  });
}

export function unmount(root: FiberRoot): void {
  reconciler.updateContainer(null, root);
}
