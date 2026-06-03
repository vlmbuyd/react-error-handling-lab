// ════════════════════════════════════════════════════════════════
// ErrorBoundary v2  ─  v1의 "throw 트릭"을 Context + hook으로 흡수
// ════════════════════════════════════════════════════════════════
// 핵심: 이 경계는 '두 종류의 에러'를 한 곳에서 받는다.
//   (1) 자식의 렌더 throw     → getDerivedStateFromError (v1과 동일)
//   (2) 자식의 비동기 에러     → showBoundary(error)를 호출해 setState로 '주입'
//   둘 다 결국 this.state.error에 모여 fallback으로 분기된다.
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { BoundaryContext } from './context';

type Props = {
  children: ReactNode;
  FallbackComponent: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, info: ErrorInfo) => void;
};

export class ErrorBoundaryV2 extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null });

  // 🔑 [버티는 줄] 비동기 에러 경로. 자식이 이 함수를 부르면 setState로 에러를 주입.
  showBoundary = (error: Error) => this.setState({ error });

  render() {
    if (this.state.error) {
      const Fallback = this.props.FallbackComponent;
      return <Fallback error={this.state.error} reset={this.reset} />;
    }
    // 🔑 [버티는 줄] showBoundary를 Context로 자식 전체에 내려보낸다 → useErrorBoundary로 꺼냄.
    return (
      <BoundaryContext.Provider value={{ showBoundary: this.showBoundary }}>
        {this.props.children}
      </BoundaryContext.Provider>
    );
  }
}

export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-4">
      <div className="flex items-start gap-2.5">
        <span className="text-red-500 text-sm mt-0.5">⚠</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-red-400">에러가 발생했어요</p>
          <p className="text-xs text-red-600 mt-0.5 break-words">{error.message}</p>
        </div>
      </div>
      <button
        onClick={reset}
        className="mt-3 text-xs text-red-400 hover:text-red-300 underline underline-offset-2 cursor-pointer"
      >
        다시 시도
      </button>
    </div>
  );
}
