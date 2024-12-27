import createReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants.js";
import { createMenuInstance } from "./instance";
import type {
  ChildSet,
  Container,
  HostContext,
  HydratableInstance,
  Instance,
  NoTimeout,
  Props,
  PublicInstance,
  SuspenceInstance,
  TextInstance,
  TimeoutHnadle,
  Type,
  UpdatePayload,
} from "./types";

const noop = (...arg: unknown[]) => void 0;

export const reconciler = createReconciler<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenceInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHnadle,
  NoTimeout
>({
  supportsMutation: false,
  supportsPersistence: true,
  supportsHydration: false,
  isPrimaryRenderer: true,

  createInstance(type, props, rootContainer, hostContext): Instance {
    return createMenuInstance(
      type,
      { ...props, ...rootContainer.overrideProps },
      rootContainer.api,
    );
  },

  appendChild(parent, child) {
    if (child) parent.children.push(child);
  },
  appendInitialChild(parent, child) {
    if (child) parent.children.push(child);
  },

  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainer,
    hostContext,
  ) {
    instance.commitUpdate(newProps);
    return null;
  },

  cloneInstance(
    instance: Instance,
    updatePayload: UpdatePayload,
    type: Type,
    oldProps: Props,
    newProps: Props,
    internalInstanceHandle,
    keepChildren: boolean,
    recyclableInstance: null | Instance,
  ): Instance {
    return (recyclableInstance ?? instance).clone(newProps, keepChildren);
  },

  createContainerChildSet: (container) => {
    return {
      ...container,
      children: [],
    } satisfies Container;
  },

  appendChildToContainerChildSet(childSet, child) {
    childSet.children.push(child);
  },

  replaceContainerChildren(container, newChildren) {
    for (const instance of container.children) {
      instance?.dispose();
    }

    for (const instance of newChildren.children) {
      instance?.commitCreate();
    }
  },

  detachDeletedInstance: (node: Instance): void => {
    node.dispose().catch(() => null);
  },

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  getCurrentEventPriority: () => DefaultEventPriority,

  createTextInstance: () => null,
  finalizeInitialChildren: () => true,
  shouldSetTextContent: () => false,
  getRootHostContext: () => null,
  getChildHostContext: () => null,
  getPublicInstance: (instance) => instance,
  prepareForCommit: () => null,
  commitMount: noop,
  resetAfterCommit: noop,
  finalizeContainerChildren: noop,
  preparePortalMount: noop,
  getInstanceFromNode: noop,
  beforeActiveInstanceBlur: noop,
  afterActiveInstanceBlur: noop,
  prepareScopeUpdate: noop,
  getInstanceFromScope: () => null,
});
