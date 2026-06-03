// ErrorBoundaryV2가 Context로 내려준 showBoundary를 자식이 꺼내 쓰는 통로.
// (경계 바깥에서 쓰면 ctx가 null → 던져서 알려준다)
import React from 'react';
import { BoundaryContext } from './context';

export function useErrorBoundary() {
  const ctx = React.useContext(BoundaryContext);
  if (!ctx) throw new Error('ErrorBoundary 안에서 사용해주세요');
  return ctx;
}
