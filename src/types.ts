import type { ReactNode } from "react";
import type { Menus, Tabs } from "webextension-polyfill";
import type { RequiredOf } from "./utils";

type MenuCreateProps = Omit<Menus.CreateCreatePropertiesType, "onclick">;

export interface FiberProps extends RequiredOf<MenuCreateProps, "title"> {
  onClick?: (info: Menus.OnClickData, tab?: Tabs.Tab) => void;
  children?: ReactNode;
  key?: React.Key;
}

export type BaseElementProps = Omit<FiberProps, "id" | "type" | "parentId">;

export type Type = Menus.ItemType;
export type Props = Omit<FiberProps, "key">;
export type InstanceProps = RequiredOf<Props, "id" | "type">;
export type Instance = {
  readonly type: Type;
  readonly props: InstanceProps;
  readonly children: Instance[];

  appendChild(child: Instance | TextInstance): void;
  clone(newProps: Props, keepChildren: boolean): Instance;

  commitCreate(): Promise<void>;
  commitUpdate(newProps: Props): Promise<void>;
  dispose(): Promise<void>;
};
export interface Container {
  children: (Instance | TextInstance)[];
  api: MenuApi;
  overrideProps: Pick<
    Props,
    "contexts" | "documentUrlPatterns" | "targetUrlPatterns"
  >;
}
export type TextInstance = null;
export type SuspenceInstance = null;
export type HydratableInstance = null;
export type PublicInstance = Instance | TextInstance;
export type HostContext = null;
export type UpdatePayload = undefined;
export type ChildSet = Container;
export type TimeoutHnadle = number;
export type NoTimeout = -1;

export type MenuApi = Pick<
  Menus.Static,
  "create" | "onClicked" | "remove" | "update"
>;
