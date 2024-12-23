import type { ReactNode } from "react";
import type { Menus, Tabs } from "webextension-polyfill";
import type { RequiredOf } from "./utils";

type MenuCreateProps = Omit<Menus.CreateCreatePropertiesType, "onclick">;

export interface MenuComponentProps
  extends RequiredOf<MenuCreateProps, "title"> {
  onClick?: (info: Menus.OnClickData, tab?: Tabs.Tab) => void;
  children?: ReactNode;
  key?: React.Key;
}

export type Type = Menus.ItemType;
export type Props = Omit<MenuComponentProps, "key">;
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
export type Container = (Instance | TextInstance)[];
export type TextInstance = null;
export type SuspenceInstance = null;
export type HydratableInstance = null;
export type PublicInstance = Instance | TextInstance;
export type HostContext = null;
export type UpdatePayload = undefined;
export type ChildSet = Container;
export type TimeoutHnadle = number;
export type NoTimeout = -1;
