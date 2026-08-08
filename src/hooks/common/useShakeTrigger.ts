import { useCallback, useState } from "react";

// 입력 흔들기(shake) 재생용 트리거. shake()를 부를 때마다 shakeKey가 올라가
// TextArea 등 shakeKey를 받는 컴포넌트의 흔들기 애니메이션을 재시작한다.
export function useShakeTrigger() {
  const [shakeKey, setShakeKey] = useState(0);
  const shake = useCallback(() => setShakeKey((n) => n + 1), []);
  return { shakeKey, shake };
}
