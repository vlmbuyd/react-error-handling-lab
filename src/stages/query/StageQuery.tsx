// ════════════════════════════════════════════════════════════════
// useSuspenseQuery  ─  "use는 인프라, React Query는 그 위의 정책"
// ════════════════════════════════════════════════════════════════
// cache 탭에서 본 무한 suspend의 정체: render 안에서 만든 promise는 매번 새 참조였다.
// React Query는 promise를 queryKey로 캐시한다 → 같은 키면 같은 참조를 돌려준다.
//   그래서 promise를 render 안에서 만들어도(=props로 키를 만들어도) 무한 루프가 안 난다.
//
// 핵심: useSuspenseQuery는 throw 메커니즘을 '발명'하지 않았다. 내부에서 use와 똑같이
//   pending이면 suspend, error면 throw한다. React Query가 더한 건 그 위의 '캐시(정책)'다.
// 🔑 [버티는 줄] queryKey ─ "이 데이터의 정체성". 같은 키 = 같은 캐시 = 같은 참조.
// 🧪 직접 해보기: queryKey를 매번 다르게(예: ['user', Math.random()]) 주면 어떻게 될까?
import { Suspense } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { ErrorBoundaryV2, ErrorFallback } from '../v2/ErrorBoundaryV2';
import { fetchUser } from '../shared/fetchers';

// QueryClient = 캐시 그 자체. 컴포넌트 '바깥'에서 한 번만 만든다.
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function UserProfileQuery() {
  // 🔑 [버티는 줄] isLoading·isError 분기가 없다 (useQuery와 다른 점).
  //    데이터가 없으면 내부에서 suspend, 에러면 throw → 로딩/에러는 바깥 경계가 맡는다.
  const { data: user } = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

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

export function StageQuery() {
  // 경계 합성은 v3·use와 동일하다. 바뀐 건 데이터 소스(캐시 보장)뿐.
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundaryV2 FallbackComponent={ErrorFallback}>
        <Suspense fallback={<SuspenseFallback />}>
          <UserProfileQuery />
        </Suspense>
      </ErrorBoundaryV2>
    </QueryClientProvider>
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
