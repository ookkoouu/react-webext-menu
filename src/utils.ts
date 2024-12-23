export function randomStr() {
  return Math.random().toString(36).slice(2);
}

export function randomNum() {
  return Math.floor(Math.random() * 1e12);
}

export function omit<T extends {}, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  return Object.fromEntries(
    //@ts-expect-error
    Object.entries(obj).filter(([k]) => !keys.includes(k)),
  ) as Omit<T, K>;
}

type Pretty<T> = { [P in keyof T]: T[P] };
export type RequiredOf<T, K extends keyof T> = Pretty<
  Required<Pick<T, K>> & Omit<T, K>
>;
