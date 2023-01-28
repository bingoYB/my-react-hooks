import { useSafeState } from "ahooks";
import { useCallback, useEffect, useRef, MutableRefObject } from "react";

export interface useOuterClickOption {
  /**
   * 触发隐藏的事件类型
   */
  action: keyof DocumentEventMap;
  /**
   * 是否捕获阶段触发
   */
  isCapture: boolean;
  /**
   * 额外点击不会隐藏的排除目标
   */
  extraTargets: MutableRefObject<HTMLElement | null>[];
}

export type useOuterClickReturn = [
  MutableRefObject<HTMLElement | null>,
  boolean,
  (visible: boolean) => void
];

/**
 * 下拉内容点击内容外进行隐藏功能的封装
 * @example const [ref, visible, setVisible] = useOuterClick(false);
 */
export default function useOuterClick(
  initState: boolean,
  { action = "click", isCapture = true, extraTargets = [] }: useOuterClickOption
): useOuterClickReturn {
  const ref: MutableRefObject<HTMLElement | null> = useRef(null);
  
  const [visible, setVisible] = useSafeState(initState);

  const judgeState = useCallback(
    (e) => {
      if (ref.current === null) return;

      let tag = ref.current.contains(e.target);

      // 额外点击不会隐藏的排除目标
      if (!tag) {
        for (let i = 0; i < extraTargets.length; i++) {
          const el = extraTargets[i].current;
          if (el) {
            tag = el.contains(e.target);
          }
        }
      }

      if (!tag) {
        document.removeEventListener(action, judgeState, {
          capture: isCapture,
        });
        setVisible(false);
      }
    },
    [action, extraTargets, isCapture, setVisible]
  );

  useEffect(() => {
    if (visible) {
      document.addEventListener(action, judgeState, { capture: isCapture });
      return () =>
        document.removeEventListener(action, judgeState, {
          capture: isCapture,
        }); //销毁阶段
    }
  }, [action, isCapture, judgeState, visible]);

  return [ref, visible, setVisible];
}
