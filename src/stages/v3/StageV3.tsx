// 🤔 throw Error는 ErrorBoundary가, throw Promise는 Suspense가 잡는다.
//    그래서 둘을 '겹쳐서' 감싼다. 안쪽 Suspense가 로딩을, 바깥 ErrorBoundary가 에러를 담당.
import { Suspense } from 'react';
import { ErrorBoundaryV2, ErrorFallback } from '../v2/ErrorBoundaryV2';
import { UserProfileV3 } from './UserProfileV3';

export function StageV3() {
  return (
    <ErrorBoundaryV2 FallbackComponent={ErrorFallback}>
      <Suspense fallback={<SuspenseFallback />}>
        <UserProfileV3 />
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
