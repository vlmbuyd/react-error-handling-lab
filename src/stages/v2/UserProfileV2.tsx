// ════════════════════════════════════════════════════════════════
// v2. showBoundary 패턴  ─  v1의 트릭을 hook 한 줄로 캡슐화
// ════════════════════════════════════════════════════════════════
// 🔑 [버티는 줄] showBoundary를 꺼내 .catch에 연결하면 끝. v1의 throw 트릭이 안 보인다.
// 🧪 직접 해보기: v1/UserProfileV1.tsx와 나란히 놓고 '사라진 코드'를 세어보기.
import { useEffect, useState } from 'react';
import { fetchUser } from '../shared/fetchers';
import { useErrorBoundary } from './useErrorBoundary';
import type { User } from '../shared/types';

export function UserProfileV2() {
  const { showBoundary } = useErrorBoundary();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(showBoundary);
  }, [showBoundary]);

  if (!user) return <LoadingSkeleton />;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-sm font-semibold text-purple-300">
        {user.name[0]}
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-100">{user.name}</p>
        <p className="text-xs text-zinc-500">{user.profile?.address.city ?? '—'}</p>
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
