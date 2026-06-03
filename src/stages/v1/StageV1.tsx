// 🤔 ErrorBoundary는 '터지는 컴포넌트의 바깥'을 감싼다. 왜 자기 자신은 자기 에러를 못 잡을까?
import { ErrorBoundaryV1 } from './ErrorBoundaryV1';
import { UserProfileV1 } from './UserProfileV1';

export function StageV1() {
  return (
    <ErrorBoundaryV1
      fallback={(error, reset) => (
        <ErrorFallback error={error} reset={reset} />
      )}
    >
      <UserProfileV1 />
    </ErrorBoundaryV1>
  );
}

function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-4">
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
