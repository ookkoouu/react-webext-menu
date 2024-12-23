import type { MenuComponentProps } from "./types";

type BaseProps = Omit<MenuComponentProps, "id" | "type" | "parentId">;
type NormalProps = Omit<BaseProps, "checked">;
type CheckboxProps = Omit<BaseProps, "children">;
type RadioProps = CheckboxProps;
// biome-ignore lint/complexity/noBannedTypes: <explanation>
type SeparatorProps = {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      normal: NormalProps;
      checkbox: CheckboxProps;
      radio: RadioProps;
      separator: SeparatorProps;
    }
  }
}
