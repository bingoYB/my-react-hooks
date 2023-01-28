import { useMemoizedFn, useSafeState } from "ahooks";
import Cookies from "js-cookie";
import { omit } from "lodash";
import { useMemo } from "react";

export type useCookieStateOption<T> = {
  defaultValue?: T;
} & Cookies.CookieAttributes;

export type useCookieStateReturn<T> = [T, (value: T) => void];

/**
 * 支持对象的cookie状态
 */
export default function useCookieState<T extends object>(
  cookieKey: string,
  option: useCookieStateOption<T>
): useCookieStateReturn<T> {
  const [state, setState] = useSafeState(
    Cookies.get(cookieKey) || option.defaultValue
  );

  const changeState = useMemoizedFn((value) => {
    if (typeof value === "object") {
      value = encodeURIComponent(JSON.stringify(value));
    }
    Cookies.set(cookieKey, value, omit(option, ["defaultValue"]));
    setState(value);
  });

  const deserializationValue = useMemo(() => {
    try {
      if (typeof state === "string") {
        return JSON.parse(decodeURIComponent(state));
      }
      return state;
    } catch (error) {
      return state;
    }
  }, [state]);

  return [deserializationValue, changeState];
}
