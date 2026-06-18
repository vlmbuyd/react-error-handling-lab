// use()도 v3와 똑같이 throw 메커니즘 위에 산다 → 경계 합성도 v3와 동일.
//   안쪽 Suspense가 throw된 promise를, 바깥 ErrorBoundary가 throw된 error를 잡는다.
//   (use는 '엔진'을 갈아끼웠을 뿐, 트리 스코프 catch라는 구조는 그대로다)
import { Suspense } from 'react';
import { ErrorBoundaryV2, ErrorFallback } from '../v2/ErrorBoundaryV2';
import { UserProfileUse } from './UserProfileUse';

export function StageUse() {
  return (
    <ErrorBoundaryV2 FallbackComponent={ErrorFallback}>
      <Suspense fallback={<SuspenseFallback />}>
        <UserProfileUse />
      </Suspense>
    </ErrorBoundaryV2>
  );
}

function SuspenseFallback() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-zinc-800" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-28 rounded bg-zinc-800" />
        <div className="h-3 w-16 rounded bg-zinc-800" />
      </div>
    </div>
  );
}
