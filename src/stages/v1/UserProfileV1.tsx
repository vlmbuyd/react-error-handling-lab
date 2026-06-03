// ════════════════════════════════════════════════════════════════
// v1. ErrorBoundary + "다시 throw" 트릭  ─  비동기 에러를 화면으로 끌어올리기
// ════════════════════════════════════════════════════════════════
// 🔑 [버티는 줄] state에 담긴 비동기 에러를 '렌더 중에' 다시 throw → 바깥 ErrorBoundary가 포착.
// 🧪 직접 해보기: `if (asyncError) throw asyncError` 줄을 지우고 ?fail=true로 돌려보면?
import { useEffect, useState } from 'react';
import { fetchUser } from '../shared/fetchers';
import type { User } from '../shared/types';

export function UserProfileV1() {
  const [asyncError, setAsyncError] = useState<Error | null>(null);
  if (asyncError) throw asyncError;

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(setAsyncError);
  }, []);

  if (!user) return <LoadingSkeleton />;

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

function LoadingSkeleton() {
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
