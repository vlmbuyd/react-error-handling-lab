# 학습 진행 상태 (PROGRESS)

> 세션이 바뀌어도 여기를 읽으면 이어갈 수 있다. `/wrap`이 매 세션 끝에 갱신한다.
> **이 파일은 "어디까지 왔나"를 적는 곳이지, 정답을 적는 곳이 아니다.**

## 지금 단계

- **현재 버전**: v1 (진입 — v0 완전 종료. ErrorBoundary 구조까지 봄: 부모 위치 + `getDerivedStateFromError`를 React가 자동 호출)
- **마지막 세션 날짜**: 2026-06-15
- **다음 세션 시작점**: (1) **v1 [버티는 줄] 실험** — `if (asyncError) throw asyncError`(`UserProfileV1.tsx` 12줄) 지우고 `?fail=true` 돌리기: 왜 굳이 비동기 에러를 렌더 중 다시 throw해 ErrorBoundary로 끌어올리나? (예측→실행) / 멈춘 질문 원문: "이 한 줄이 없으면 무슨 일이 벌어질 것 같아요?" 그다음 (2) `getDerivedStateFromError`는 왜 static / `componentDidCatch`와 역할 분리.
- **학습자가 남긴 더 깊은 질문(다음에)**: class 인스턴스 vs 함수형 컴포넌트는 *근본적으로* 뭐가 다르길래 하나는 렌더 중 pop돼 사라지고 하나는 메서드를 기억해 살아남나? ("왜 class"의 한 겹 더 깊은 층)

## 핵심 질문 3개 — 탐구 상태

> 상태: 🔴 미탐구 / 🟡 탐구중 / 🟢 내 말로 설명 가능

| # | 질문 | 상태 |
|---|------|------|
| 1 | try/catch의 한계 + ErrorBoundary 메커니즘 + 왜 아직 class | 🟢 (try/catch·`.catch` 한계: 두 채널 경계(동기 vs Promise 체인 내부) + 시나리오3 이벤트 throw + 흰 화면 기준=render vs event / ErrorBoundary 메커니즘: 부모 위치·React가 `getDerivedStateFromError` 자동 호출·render는 자식 실행 않고 설명서만 반환(①→②) / **왜 class**: 함수+hook은 pop돼 사라져 못 잡고 class 인스턴스는 살아남아 React가 다시 와서 잡고 재렌더 — 모두 자기 말로 도달. 남은 디테일(별개): static 이유, `componentDidCatch` 역할 분리, 인스턴스 vs 함수 근본 차이) |
| 2 | Suspensive가 ErrorBoundary·Suspense 위에 더한 것 | 🔴 |
| 3 | 왜 '선언적' 에러 처리인가 + 트레이드오프 | 🔴 |

## 버전별 체크포인트

> "버티는 줄을 지웠을 때 무엇이 어떻게 깨지는지 내 말로 설명 가능" = 그 버전 클리어

- [x] v0 — async rejection을 try/catch가 못 잡는 *왜*(콜스택/마이크로태스크) ✅ / 렌더 throw(시나리오2)→흰 화면+트리 들어내는 이유 ✅ / 이벤트 throw(시나리오3) 화면 멀쩡 이유 ✅ / 두 채널 경계 + 흰 화면 기준(render vs event) 자기 말로 ✅ **— v0 종료**
- [~] v1 — ErrorBoundary 구조 + **왜 class까지 자기 말로 종료**(부모 위치 / React가 `getDerivedStateFromError` 자동 호출 / render는 자식 실행 않고 설명서만 반환 ①→② / 함수는 pop돼 사라지고 class 인스턴스는 살아남아 다시 잡음) / 남음: `throw asyncError` 트릭([버티는 줄] 실험), static 이유, `componentDidCatch` 분리
- [ ] v2 — showBoundary가 v1 트릭을 어떻게 캡슐화했나
- [ ] v3 — throw-promise: 로딩도 에러도 예외라는 관점
- [ ] v4 — hook→컴포넌트, 트리로 표현되는 데이터 의존성

## 아직 열려있는 질문 (다음 세션에 이어서)

- **(다음 시작점) v1 [버티는 줄] 실험**: `if (asyncError) throw asyncError`(`UserProfileV1.tsx` 12줄) 지우고 `?fail=true`로 돌리면? — 왜 굳이 비동기 에러를 렌더 중에 다시 `throw`해 ErrorBoundary로 끌어올리는가. (예측 → 실행)
  - 멈춘 지점 질문 원문: "이 12줄 `if (asyncError) throw asyncError`는 — 왜 굳이 비동기 에러를 렌더 중에 다시 `throw` 할까요? 이 한 줄이 없으면 무슨 일이 벌어질 것 같아요?"
- **(학습자가 남긴 더 깊은 질문) class 인스턴스 vs 함수형 컴포넌트의 근본 차이**: "class의 인스턴스와 함수형 컴포넌트는 뭐가 다르길래 렌더링 중에 pop되어 없어지거나 그 메서드를 기억해서 살아남나?" — "왜 class"의 한 겹 더 깊은 이유.
- `getDerivedStateFromError`는 왜 **static**인가(`ErrorBoundaryV1.tsx` 20줄 주석) + `componentDidCatch`와의 역할 분리(화면 분기 vs 로깅)

## 일지 목록

- 2026-06-04 — v0 시나리오 1: `.then`은 안 기다린다(A,C,B) / 비동기 throw는 try/catch가 못 잡음 / try-catch와 `.catch()`는 다른 채널
- 2026-06-11 — v0 시나리오 1 복습: 콘솔 미니 예제 3개로 then 호출(동기) vs 콜백(마이크로태스크) / try/catch가 스택 pop 후엔 못 잡는 이유 / 두 채널을 자기 말로 재확인 (새 일지 형식: 원문 + 다듬은 정리 + 이해도 점검)
- 2026-06-12 — v0 시나리오 2(렌더 throw): `!`는 런타임에 사라짐(TS erase) → `null.address`는 TypeError / 렌더 throw는 try 블록 종료 후라 못 잡고 React 내부 함수 스택까지 올라감 / ErrorBoundary 없으면 트리 전체 흰 화면 + 그 이유(반쪽 UI=거짓말, 빈 화면이 더 정직)
- 2026-06-15 — try/catch·`.catch` 에러 채널 정리와 시나리오 실습, ErrorBoundary 진입: `.catch` 실행됨=잡힘=uncaught 아님 / 바깥 try/catch는 데드코드(동기 후 pop) / 두 채널 경계(try/catch=동기, `.catch`=Promise 체인 내부만) / 시나리오3 이벤트 throw 화면 멀쩡(들어낼 UI 없음) / 흰 화면 기준=render경로 vs event경로 / (v1) ErrorBoundary 부모 위치 + React가 `getDerivedStateFromError` 자동 호출
