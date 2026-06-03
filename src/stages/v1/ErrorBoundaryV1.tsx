// ════════════════════════════════════════════════════════════════
// ErrorBoundary v1  ─  직접 구현해 본 에러 경계 (왜 아직도 class인가?)
// ════════════════════════════════════════════════════════════════
// 🤔 React 19인데 왜 이건 함수 컴포넌트 + hook이 아니라 class일까?
//    힌트: hook은 컴포넌트가 '정상 렌더된 뒤'에만 호출된다. 그런데 throw가 나면
//    렌더 자체가 중단된다 → 그 순간 hook을 부를 수가 없다.
//    (정답은 코드에 적지 않는다. /dive에서 네 말로 설명해보기.)
import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback: (error: Error, reset: () => void) => ReactNode;
};

export class ErrorBoundaryV1 extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null };

  // 🔑 [버티는 줄] 자식이 렌더 중 throw하면 React가 이 static 메서드를 호출한다.
  //    리턴한 값이 다음 렌더의 state가 됨 → render()에서 fallback으로 분기.
  // 🤔 왜 static일까? (인스턴스가 깨진 상황에서도 부를 수 있어야 하니까 — 직접 말해보기)
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  // 커밋 단계에서 호출 — 화면 분기가 아니라 '로깅' 담당 (Sentry 등). 둘의 역할 분리가 포인트.
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary v1]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}
