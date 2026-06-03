// mocks/handlers.ts
// -----------------------------------------------------------------
// MSW 핸들러 — 의도적 실패를 URL 파라미터로 제어
//
// 사용법:
//   GET /api/user          → 유저 정보
//   GET /api/user?fail=true → 500 에러
//   GET /api/posts/1       → 게시글 목록
//   GET /api/posts/1?fail=true → 500 에러
//
// profileNull 쿼리로 렌더 에러 유도:
//   GET /api/user?profileNull=true → profile 필드가 null인 유저 반환
// -----------------------------------------------------------------

import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // 유저 조회
  http.get('/api/user', async ({ request }) => {
    const url = new URL(request.url);
    const shouldFail = url.searchParams.get('fail') === 'true';
    const profileNull = url.searchParams.get('profileNull') === 'true';

    await delay(500);

    if (shouldFail) {
      return HttpResponse.json(
        { message: '유저를 불러오지 못했어요' },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      id: 1,
      name: '유월',
      profile: profileNull
        ? null
        : { address: { city: '서울' } },
    });
  }),

  // 게시글 목록 조회
  http.get('/api/posts/:userId', async ({ request }) => {
    const url = new URL(request.url);
    const shouldFail = url.searchParams.get('fail') === 'true';

    await delay(800);

    if (shouldFail) {
      return HttpResponse.json(
        { message: '게시글을 불러오지 못했어요' },
        { status: 500 },
      );
    }

    return HttpResponse.json([
      { id: 1, title: 'useState 원정대 첫 회고' },
      { id: 2, title: 'TanStack Query 구조 맵' },
      { id: 3, title: 'TypeScript 컴파일러 톺아보기' },
    ]);
  }),
];
