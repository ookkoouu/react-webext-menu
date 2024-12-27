import type { FC } from "react";
import React from "react";
import type { BaseElementProps } from "../types";

export type CheckboxProps = Omit<BaseElementProps, "children">;
export const Checkbox: FC<CheckboxProps> = (props: CheckboxProps) => {
  return <checkbox {...props} />;
};
