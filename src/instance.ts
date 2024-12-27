import equal from "fast-deep-equal";
import type { Menus, Tabs } from "webextension-polyfill";
import type { Instance, InstanceProps, MenuApi, Props, Type } from "./types";
import { omit, randomStr } from "./utils";

export class BaseMenuElement implements Instance {
  type: Type;
  props: InstanceProps;
  children: Instance[] = [];
  listenerRef: Props["onClick"];
  api: MenuApi;

  constructor(type: Type, props: Props, api: MenuApi) {
    this.type = type;
    this.props = this.createProps(props);
    this.api = api;
  }

  protected createProps(props: Props): InstanceProps {
    return Object.assign(
      {
        id: randomStr(),
        type: this.type,
      },
      props,
    );
  }

  protected updateProps(newProps: Props): boolean {
    let changed = false;
    const _newProps: InstanceProps = {
      ...newProps,
      type: this.type,
      id: this.props.id,
    };
    if (!equal(omit(_newProps, "children"), omit(this.props, "children"))) {
      changed = true;
    }
    this.props = _newProps;
    return changed;
  }

  protected onClickWrapper(info: Menus.OnClickData, tab?: Tabs.Tab) {
    if (info.menuItemId === this.props.id) {
      console.trace(`clicked ${this.props.title}:`, { info, tab });
      this.props.onClick?.(info, tab);
    }
  }

  protected addListener() {
    const cb: Props["onClick"] = (info, tab) => {
      this.onClickWrapper(info, tab);
    };

    this.listenerRef = cb;
    this.api.onClicked.addListener(cb);
  }

  protected removeListener() {
    if (this.listenerRef && this.api.onClicked.hasListener(this.listenerRef)) {
      this.api.onClicked.removeListener(this.listenerRef);
    }
  }

  clone(newProps: Props, keepChildren: boolean): Instance {
    this.updateProps(newProps);
    if (!keepChildren) {
      this.children = [];
    }
    return this;
  }

  appendChild(child: Instance): void {
    this.children.push(child);
  }

  async commitCreate(): Promise<void> {
    await this.dispose().catch(() => {});
    this.api.create(omit(this.props, "onClick", "children"));
    this.addListener();

    for (const child of this.children) {
      child.props.parentId = this.props.id;
      await child.commitCreate().catch((err) => {
        throw new Error(`child [${child.props.id}]: ${err}`);
      });
    }
  }

  async commitUpdate(newProps: Props): Promise<void> {
    const changed = this.updateProps(newProps);
    if (changed) {
      return this.api.update(
        this.props.id,
        omit(this.props, "id", "onClick", "children"),
      );
    }
  }

  dispose(): Promise<void> {
    this.removeListener();
    return this.api.remove(this.props.id);
  }
}

class NormalElement extends BaseMenuElement {
  constructor(props: Props, api: MenuApi) {
    super("normal", props, api);
  }
}
class CheckboxElement extends BaseMenuElement {
  constructor(props: Props, api: MenuApi) {
    super("checkbox", props, api);
  }
}
class RadioElement extends BaseMenuElement {
  constructor(props: Props, api: MenuApi) {
    super("radio", props, api);
  }
}
class SeparatorElement extends BaseMenuElement {
  constructor(props: Props, api: MenuApi) {
    super("separator", props, api);
  }
}

const classMap: Record<Type, { new (props: Props, api: MenuApi): Instance }> = {
  checkbox: CheckboxElement,
  normal: NormalElement,
  radio: RadioElement,
  separator: SeparatorElement,
};

export function createMenuInstance(
  type: Type,
  props: Props,
  api: MenuApi,
): Instance {
  const elementClass = classMap[type];
  if (elementClass === undefined) {
    throw new Error(`Unsupported Element "${type}"`);
  }
  return new elementClass(props, api);
}
