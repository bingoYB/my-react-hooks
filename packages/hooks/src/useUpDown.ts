import { useState } from "react";
import { useKeyPress } from "ahooks";

/**
 * 列表上下键控制
 * @param value
 * @param options
 * @returns
 */
export default function useUpDownState(
  value: number,
  options: { min: number; max: number; loop?: boolean }
) {
  const { min = 0, max } = options;
  const [state, setState] = useState(value);
  //  下键控制
  useKeyPress("downarrow", (evt) => {
    evt.preventDefault();
    if (state >= max) {
      if (options.loop) {
        setState(min);
      }
    } else {
      setState(state + 1);
    }
  });

  //上键控制
  useKeyPress("uparrow", (evt) => {
    evt.preventDefault();

    if (state >= max) {
      if (options.loop) {
        setState(max);
      }
    } else {
      setState(state - 1);
    }
  });

  return [state, setState];
}
