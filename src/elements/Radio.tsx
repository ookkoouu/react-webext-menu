import type { FC } from "react";
import React from "react";
import type { BaseElementProps } from "../types";

export type RadioProps = Omit<BaseElementProps, "children">;
export const Radio: FC<RadioProps> = (props: RadioProps) => {
  return <radio {...props} />;
};
