// ════════════════════════════════════════════════════════════════
// v3. render-as-you-fetch  ─  isLoading / isError 분기가 사라진 컴포넌트
// ════════════════════════════════════════════════════════════════
// v0의 "삼항 분기 지옥"과 비교해보면 충격적으로 짧다. 왜 가능한가:
//   데이터 없으면 read()가 suspend, 에러면 read()가 throw, 있으면 바로 값.
//   → 로딩/에러 처리는 바깥 Suspense + ErrorBoundary(StageV3.tsx)가 맡는다.
import { createResource } from './createResource';
import { fetchUser } from '../shared/fetchers';

// 🔑 [버티는 줄] fetch를 '컴포넌트 바깥에서' 시작한다 (render-as-you-fetch).
const userResource = createResource(() => fetchUser());

export function UserProfileV3() {
  // 🔑 [버티는 줄] 이 한 줄에 로딩·에러·성공이 다 들어있다 (분기 없음).
  const user = userResource.read();

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
