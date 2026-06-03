// v4. Suspensive 스타일 (의사 코드)
//
// 설치: npm install @suspensive/react @suspensive/react-query
//
// 핵심 아이디어:
//   1) useSuspenseQuery를 <SuspenseQuery> 컴포넌트로 변환
//      → 데이터 의존 관계를 컴포넌트 트리로 표현 가능
//   2) <ErrorBoundaryGroup>으로 여러 ErrorBoundary를 한 번에 리셋
//   3) children을 render prop으로 받아서 data를 자연스럽게 전달
//
// 소스 읽기 포인트:
//   - SuspenseQuery = useSuspenseQuery를 호출하고 children({ data })를 리턴하는 래퍼
//   - ErrorBoundaryGroup = Context로 reset 함수들을 모아서 group.reset() 한 번에 호출
//   - "hook을 컴포넌트로 바꾸면 뭐가 좋은가" → 트리 구조로 데이터 의존성 표현

/*
import { ErrorBoundaryGroup, ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { fetchUser, fetchPosts } from '../shared/fetchers';

export function AppV4() {
  return (
    <ErrorBoundaryGroup>
      <ErrorBoundaryGroup.Reset trigger={({ reset }) => (
        <button onClick={reset}>전체 재시도</button>
      )} />

      <ErrorBoundary fallback={({ error }) => <p>에러: {error.message}</p>}>
        <Suspense fallback={<p>유저 로딩중...</p>}>
          <SuspenseQuery queryKey={['user']} queryFn={fetchUser}>
            {({ data: user }) => (
              <>
                <h1>{user.name}</h1>

                <Suspense fallback={<p>게시글 로딩중...</p>}>
                  <SuspenseQuery
                    queryKey={['posts', user.id]}
                    queryFn={() => fetchPosts(user.id)}
                  >
                    {({ data: posts }) => (
                      <ul>
                        {posts.map((p) => <li key={p.id}>{p.title}</li>)}
                      </ul>
                    )}
                  </SuspenseQuery>
                </Suspense>
              </>
            )}
          </SuspenseQuery>
        </Suspense>
      </ErrorBoundary>
    </ErrorBoundaryGroup>
  );
}

// 주목할 점:
//   - isLoading, isError 분기가 아예 없음
//   - user → posts 의존 관계가 트리 구조 그 자체로 표현됨
//   - "전체 재시도" 버튼 하나로 그룹 안의 모든 에러가 리셋됨
*/

export {};
