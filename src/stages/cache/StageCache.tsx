// ════════════════════════════════════════════════════════════════
// 캐시 문제  ─  "use는 인프라일 뿐, '같은 데이터엔 같은 promise' 보장은 누가?"
// ════════════════════════════════════════════════════════════════
// use 탭은 promise를 컴포넌트 '바깥'에서 만들었다. 매 렌더 같은 참조 → 잘 됐다.
// 그런데 실무는 보통 props(userId 등)로 매번 다른 데이터를 받는다. props를 보려면
// promise를 render '안'에서 만들 수밖에 없다. 그 순간 무슨 일이 벌어지나?
//
// 🧪 직접 해보기: 네트워크 탭을 열어두고 아래 토글을 'render 안에서 생성'으로 바꿔보기.
//    → fallback이 영원히 안 사라지고 요청이 계속 쌓인다.
//    🤔 매 렌더마다 fetchUser()가 '새 promise'를 만들면 use는 매번 새 pending을 throw한다.
//       resolve → 재렌더 → 또 새 promise → 또 throw … 이 고리를 끊는 책임은 누구 몫인가? (→ query 탭)
import { Suspense, use, useState } from 'react';
import { ErrorBoundaryV2, ErrorFallback } from '../v2/ErrorBoundaryV2';
import { fetchUser } from '../shared/fetchers';

// 바깥에서 한 번 만든 안정 참조 (use 탭과 동일).
const stablePromise = fetchUser();

function UserCard({ inline }: { inline: boolean }) {
  // 🔑 [버티는 줄] inline=true면 매 렌더 '새 promise' → 매번 새 pending throw → 무한 suspend.
  //    inline=false면 바깥 안정 참조 → 딱 한 번만 throw → 정상.
  const user = use(inline ? fetchUser() : stablePromise);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-sm font-semibold text-purple-300">
        {user.name[0]}
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-100">{user.name}</p>
        <p className="text-xs text-zinc-500">{user.profile!.address.city}</p>
      </div>
    </div>
  );
}

export function StageCache() {
  const [inline, setInline] = useState(false);

  return (
    <div className="space-y-4">
      {/* 토글은 경계 '바깥'에 둔다 → 무한 로딩에 빠져도 항상 눌러서 멈출 수 있다. */}
      <div className="flex gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800/80 text-xs">
        <button
          onClick={() => setInline(false)}
          className={[
            'flex-1 rounded-md py-1.5 font-medium transition-colors cursor-pointer',
            !inline ? 'bg-emerald-600/80 text-white' : 'text-zinc-500 hover:text-zinc-300',
          ].join(' ')}
        >
          바깥에서 생성 (안정)
        </button>
        <button
          onClick={() => setInline(true)}
          className={[
            'flex-1 rounded-md py-1.5 font-medium transition-colors cursor-pointer',
            inline ? 'bg-red-600/80 text-white' : 'text-zinc-500 hover:text-zinc-300',
          ].join(' ')}
        >
          render 안에서 생성 (깨짐)
        </button>
      </div>

      {/* key로 모드를 바꿀 때마다 subtree를 재마운트 → 깨진 모드를 끄면 깔끔히 멈춘다. */}
      <ErrorBoundaryV2 key={String(inline)} FallbackComponent={ErrorFallback}>
        <Suspense fallback={<SuspenseFallback inline={inline} />}>
          <UserCard inline={inline} />
        </Suspense>
      </ErrorBoundaryV2>
    </div>
  );
}

function SuspenseFallback({ inline }: { inline: boolean }) {
  if (inline) {
    return (
      <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3">
        <p className="text-xs font-semibold text-red-400">⏳ 무한 로딩</p>
        <p className="text-xs text-red-600 mt-0.5 leading-relaxed">
          fallback이 안 사라진다. 네트워크 탭을 보면 요청이 계속 쌓인다.
          <br />
          토글을 '안정'으로 되돌리면 멈춘다.
        </p>
      </div>
    );
  }
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
