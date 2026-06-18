// ════════════════════════════════════════════════════════════════
// use(). throw 패턴의 '공식화'  ─  라이브러리 trick이 React 1급 API로
// ════════════════════════════════════════════════════════════════
// v3에서 우리가 손으로 짠 createResource.read()의 세 갈래
//   (pending→throw promise / error→throw error / success→return value)
// 를 React 19의 use()가 통째로 흡수했다. status 클로저 변수도, switch도 사라진다.
//
// 🧪 직접 해보기: v3/createResource.ts와 이 파일을 나란히 놓고 '사라진 코드'를 세어보기.
//    (read()의 switch 세 줄이 use(...) 한 단어가 됐다)
import { use } from 'react';
import { fetchUser } from '../shared/fetchers';

// 🔑 [버티는 줄] promise를 '컴포넌트 바깥에서' 한 번만 만든다 (참조 안정).
//    v3의 `createResource(() => fetchUser())`와 똑같은 위치·똑같은 이유.
//    🤔 왜 여기여야 하나? 안으로 옮기면 무슨 일이? (→ cache 탭에서 직접 터뜨려본다)
const userPromise = fetchUser();

export function UserProfileUse() {
  // 🔑 [버티는 줄] pending이면 use가 promise를 throw(→Suspense),
  //    reject면 error를 throw(→ErrorBoundary), resolve면 값.
  //    createResource.read()의 switch가 이 한 줄로 압축됐다.
  const user = use(userPromise);

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
