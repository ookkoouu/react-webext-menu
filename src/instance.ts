import equal from "fast-deep-equal";
import Browser, { type Menus, type Tabs } from "webextension-polyfill";
import type { Instance, InstanceProps, Props, Type } from "./types";
import { omit, randomStr } from "./utils";

const api = Browser.contextMenus;

export class BaseMenuElement implements Instance {
  type: Type;
  props: InstanceProps;
  children: Instance[] = [];
  listenerRef: Props["onClick"];

  constructor(type: Type, props: Props) {
    this.type = type;
    this.props = this.createProps(props);
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
      console.log(`clicked ${this.props.id}:`, { info, tab });
      this.props.onClick?.(info, tab);
    }
  }

  protected addListener() {
    const cb: Props["onClick"] = (info, tab) => {
      this.onClickWrapper(info, tab);
    };

    this.listenerRef = cb;
    api.onClicked.addListener(cb);
  }

  protected removeListener() {
    if (this.listenerRef && api.onClicked.hasListener(this.listenerRef)) {
      api.onClicked.removeListener(this.listenerRef);
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
    try {
      api.create(omit(this.props, "onClick", "children"));
    } catch (err) {
      console.log(`[${this.props.id}] create error: ${err}`);
      throw err;
    }
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
      return api.update(
        this.props.id,
        omit(this.props, "id", "onClick", "children"),
      );
    }
  }

  dispose(): Promise<void> {
    this.removeListener();
    return api.remove(this.props.id);
  }
}

class NormalElement extends BaseMenuElement {
  constructor(props: Props) {
    super("normal", props);
  }
}
class CheckboxElement extends BaseMenuElement {
  constructor(props: Props) {
    super("checkbox", props);
  }
}
class RadioElement extends BaseMenuElement {
  constructor(props: Props) {
    super("radio", props);
  }
}
class SeparatorElement extends BaseMenuElement {
  constructor(props: Props) {
    super("separator", props);
  }
}

const classMap: Record<Type, { new (props: Props): Instance }> = {
  checkbox: CheckboxElement,
  normal: NormalElement,
  radio: RadioElement,
  separator: SeparatorElement,
};

export function createMenuInstance(type: Type, props: Props): Instance {
  const elementClass = classMap[type];
  if (elementClass === undefined) {
    throw new Error(`Unsupported Element "${type}"`);
  }
  return new elementClass(props);
}
