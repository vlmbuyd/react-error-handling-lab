// ════════════════════════════════════════════════════════════════
// v3. createResource  ─  "로딩도 에러도 throw" (Suspense의 심장)
// ════════════════════════════════════════════════════════════════
// 큰 전환: React에게 로딩과 에러는 '둘 다 예외'다. 무엇을 throw하느냐로 누가 잡을지 갈린다.
//   throw Promise → Suspense가 잡아서 fallback 표시 (그 Promise가 resolve되면 재시도)
//   throw Error   → ErrorBoundary가 잡아서 에러 fallback 표시
// 🤔 왜 'Promise를 던진다'는 발상이 isLoading 분기를 통째로 없앨 수 있을까?
export type Resource<T> = { read: () => T };

export function createResource<T>(promiseFn: () => Promise<T>): Resource<T> {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T | Error;

  // fetch를 '컴포넌트 바깥에서' 미리 시작하고, 끝나면 status/result를 갱신해 둔다.
  const promise = promiseFn().then(
    (data) => { status = 'success'; result = data; },
    (error) => { status = 'error'; result = error; },
  );

  return {
    // 🔑 [버티는 줄] read()의 이 세 갈래가 v3의 전부다.
    // 🧪 직접 해보기: `case 'pending': throw promise` 줄을 `return undefined as T`로 바꿔보면?
    //    (Suspense fallback이 안 뜨고 깨진 화면이 그대로 그려진다 → 이 줄이 'suspend'의 정체)
    read() {
      switch (status) {
        case 'pending': throw promise;  // ⏳ Suspense가 잡음
        case 'error':   throw result;   // 💥 ErrorBoundary가 잡음
        case 'success': return result as T;
      }
    },
  };
}
