import type { FC } from "react";
import React from "react";
import type { BaseElementProps } from "../types";

export type NormalProps = Omit<BaseElementProps, "checked">;
export const Normal: FC<NormalProps> = (props: NormalProps) => {
  return <normal {...props}>{props.children}</normal>;
};
