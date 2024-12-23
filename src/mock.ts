import type { Menus, Tabs } from "webextension-polyfill";
import { randomStr } from "./utils";

const menuStore: Map<string, Menus.CreateCreatePropertiesType> = new Map();
const handlerStore: Set<Menus.CreateCreatePropertiesType["onclick"]> =
  new Set();

export const mock: Menus.Static = {
  create: (
    createProperties: Menus.CreateCreatePropertiesType,
    callback?: () => void,
  ): number | string => {
    const id = createProperties.id ?? randomStr();
    menuStore.set(id, createProperties);
    callback?.();
    return id;
  },
  update: async (
    id: number | string,
    updateProperties: Menus.UpdateUpdatePropertiesType,
  ): Promise<void> => {
    menuStore.set(String(id), updateProperties);
  },
  remove: async (menuItemId: number | string): Promise<void> => {
    menuStore.delete(String(menuItemId));
  },
  removeAll: async (): Promise<void> => {
    menuStore.clear();
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
      callback: (info: Menus.OnClickData, tab: Tabs.Tab | undefined) => void,
      ...params: unknown[]
    ): void => {
      handlerStore.add(callback);
    },
    removeListener: (
      callback: (info: Menus.OnClickData, tab: Tabs.Tab | undefined) => void,
    ): void => {
      handlerStore.delete(callback);
    },
    hasListener: (
      callback: (info: Menus.OnClickData, tab: Tabs.Tab | undefined) => void,
    ): boolean => handlerStore.has(callback),
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
};
