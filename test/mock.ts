import type { Menus, Tabs } from "webextension-polyfill";
import { randomStr } from "../src/utils";

type Clicker = (
  id: string,
  info?: Omit<Menus.OnClickData, "menuItemId">,
  tab?: Tabs.Tab,
) => void;

export function createBrowserMock(): {
  mock: Menus.Static;
  menus: Map<string, Menus.CreateCreatePropertiesType>;
  click: Clicker;
} {
  const menus: Map<string, Menus.CreateCreatePropertiesType> = new Map();
  const handlers: Set<(info: Menus.OnClickData, tab?: Tabs.Tab) => void> =
    new Set();

  return {
    click: (id, info, tab) => {
      for (const hdl of handlers) {
        hdl({ menuItemId: id, editable: false, modifiers: [], ...info }, tab);
      }
    },
    menus,
    mock: {
      create: (
        createProperties: Menus.CreateCreatePropertiesType,
        callback?: () => void,
      ): number | string => {
        const id = createProperties.id ?? randomStr();
        menus.set(id, createProperties);
        callback?.();

        return id;
      },
      update: async (
        id: number | string,
        updateProperties: Menus.UpdateUpdatePropertiesType,
      ): Promise<void> => {
        menus.set(String(id), updateProperties);
      },
      remove: async (menuItemId: number | string): Promise<void> => {
        menus.delete(String(menuItemId));
      },
      removeAll: async (): Promise<void> => {
        menus.clear();
      },
      overrideContext: (
        contextOptions: Menus.OverrideContextContextOptionsType,
      ): void => {
        throw new Error("Function not implemented.");
      },
      refresh: (): Promise<void> => {
        throw new Error("Function not implemented.");
      },
      getTargetElement: (targetElementId: number): Element => {
        throw new Error("Function not implemented.");
      },
      onClicked: {
        addListener: (
          callback: (
            info: Menus.OnClickData,
            tab: Tabs.Tab | undefined,
          ) => void,
          ...params: unknown[]
        ): void => {
          handlers.add(callback);
        },
        removeListener: (
          callback: (
            info: Menus.OnClickData,
            tab: Tabs.Tab | undefined,
          ) => void,
        ): void => {
          handlers.delete(callback);
        },
        hasListener: (
          callback: (
            info: Menus.OnClickData,
            tab: Tabs.Tab | undefined,
          ) => void,
        ): boolean => handlers.has(callback),
      },
      onShown: {
        addListener: (
          callback: (info: Menus.OnShownInfoType, tab: Tabs.Tab) => void,
          ...params: unknown[]
        ): void => {
          throw new Error("Function not implemented.");
        },
        removeListener: (
          callback: (info: Menus.OnShownInfoType, tab: Tabs.Tab) => void,
        ): void => {
          throw new Error("Function not implemented.");
        },
        hasListener: (
          callback: (info: Menus.OnShownInfoType, tab: Tabs.Tab) => void,
        ): boolean => {
          throw new Error("Function not implemented.");
        },
      },
      onHidden: {
        addListener: (callback: () => void, ...params: unknown[]): void => {
          throw new Error("Function not implemented.");
        },
        removeListener: (callback: () => void): void => {
          throw new Error("Function not implemented.");
        },
        hasListener: (callback: () => void): boolean => {
          throw new Error("Function not implemented.");
        },
      },
      ACTION_MENU_TOP_LEVEL_LIMIT: 6,
    },
  };
}
