import type {
  CheckboxProps,
  NormalProps,
  RadioProps,
  SeparatorProps,
} from "./elements";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      checkbox: CheckboxProps;
      normal: NormalProps;
      radio: RadioProps;
      separator: SeparatorProps;
    }
  }
}
