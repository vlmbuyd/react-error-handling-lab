# 학습 진행 상태 (PROGRESS)

> 세션이 바뀌어도 여기를 읽으면 이어갈 수 있다. `/wrap`이 매 세션 끝에 갱신한다.
> **이 파일은 "어디까지 왔나"를 적는 곳이지, 정답을 적는 곳이 아니다.**

## 지금 단계

- **현재 버전**: v1 **완료** → v2 진입 직전. (v1 [버티는 줄] 실험 + 12줄 트릭 + static/componentDidCatch 역할 분리까지 모두 자기 말로 종료)
- **마지막 세션 날짜**: 2026-06-16
- **다음 세션 시작점**: **v2 진입**. `UserProfileV2.tsx`를 열어 v1과 비교 — v1의 "state + `if throw` 두 줄"이 사라지고 `showBoundary`(`useErrorBoundary`)가 그 자리에 어떻게 들어왔나. "이전 버전이 번거로웠던 무엇을 v2가 어떻게 감췄나"로 진행. (사실 확인됨: `react-error-boundary`의 `showBoundary`는 현업 표준 패턴)
- **학습자가 남긴 더 깊은 질문(다음에)**: class 인스턴스 vs 함수형 컴포넌트는 *근본적으로* 뭐가 다르길래 하나는 렌더 중 pop돼 사라지고 하나는 메서드를 기억해 살아남나? ("왜 class"의 한 겹 더 깊은 층)

## 핵심 질문 3개 — 탐구 상태

> 상태: 🔴 미탐구 / 🟡 탐구중 / 🟢 내 말로 설명 가능

| # | 질문 | 상태 |
|---|------|------|
| 1 | try/catch의 한계 + ErrorBoundary 메커니즘 + 왜 아직 class | 🟢 **(완료)** try/catch·`.catch` 한계(두 채널 경계, render vs event 기준) / ErrorBoundary 메커니즘(부모 위치, React가 `getDerivedStateFromError` 자동 호출 → 리턴값 state 병합 → 재렌더 → fallback, ①→②) / **왜 class**(함수는 pop돼 사라지고 인스턴스는 React가 참조로 쥐고 있어 다시 부름) / **v1 12줄 트릭**(비동기 에러를 state에 담고 렌더 중 다시 throw해 render 경로로 끌어올림) / static=render 단계 순수성, `componentDidCatch`=commit 단계 로깅 — 모두 자기 말로. 남은 더 깊은 질문(별개): 인스턴스 vs 함수 근본 차이 |
| 2 | Suspensive가 ErrorBoundary·Suspense 위에 더한 것 | 🔴 |
| 3 | 왜 '선언적' 에러 처리인가 + 트레이드오프 | 🔴 |

## 버전별 체크포인트

> "버티는 줄을 지웠을 때 무엇이 어떻게 깨지는지 내 말로 설명 가능" = 그 버전 클리어

- [x] v0 — async rejection을 try/catch가 못 잡는 *왜*(콜스택/마이크로태스크) ✅ / 렌더 throw(시나리오2)→흰 화면+트리 들어내는 이유 ✅ / 이벤트 throw(시나리오3) 화면 멀쩡 이유 ✅ / 두 채널 경계 + 흰 화면 기준(render vs event) 자기 말로 ✅ **— v0 종료**
- [x] v1 — **완료**. ErrorBoundary 구조 + 왜 class / 에러 흐름(getDerivedStateFromError 리턴→state 병합→재렌더→fallback) / **[버티는 줄] 12줄 트릭**(지우면 영원한 로딩 거짓 화면 → 비동기 에러를 state에 담고 렌더 중 다시 throw해 render 경로로 끌어올려 ErrorBoundary가 잡게) / ErrorBoundary 기준=render 도중(초기든 재렌더든) / static=순수(render 단계) vs componentDidCatch=로깅(commit 단계) — 모두 자기 말로
- [ ] v2 — showBoundary가 v1 트릭을 어떻게 캡슐화했나 **(다음 시작점)**
- [ ] v3 — throw-promise: 로딩도 에러도 예외라는 관점
- [ ] v4 — hook→컴포넌트, 트리로 표현되는 데이터 의존성

## 아직 열려있는 질문 (다음 세션에 이어서)

- **(다음 시작점) v2 진입**: v1에서 매 컴포넌트마다 반복하던 "state + `if (asyncError) throw` 두 줄"을, v2의 `showBoundary`(`useErrorBoundary`)가 어떻게 한 줄로 감췄나. `UserProfileV2.tsx`를 열어 v1과 비교 — "어떤 줄이 사라지고 무엇이 새로 생겼나"부터.
  - 멈춘 지점 질문 원문: "`UserProfileV2.tsx`를 열어 v1과 비교해 어떤 줄이 사라졌어?"
- **(학습자가 남긴 더 깊은 질문) class 인스턴스 vs 함수형 컴포넌트의 근본 차이**: "class의 인스턴스와 함수형 컴포넌트는 뭐가 다르길래 렌더링 중에 pop되어 없어지거나 그 메서드를 기억해서 살아남나?" — "왜 class"의 한 겹 더 깊은 이유.

## 일지 목록

- 2026-06-04 — v0 시나리오 1: `.then`은 안 기다린다(A,C,B) / 비동기 throw는 try/catch가 못 잡음 / try-catch와 `.catch()`는 다른 채널
- 2026-06-11 — v0 시나리오 1 복습: 콘솔 미니 예제 3개로 then 호출(동기) vs 콜백(마이크로태스크) / try/catch가 스택 pop 후엔 못 잡는 이유 / 두 채널을 자기 말로 재확인 (새 일지 형식: 원문 + 다듬은 정리 + 이해도 점검)
- 2026-06-12 — v0 시나리오 2(렌더 throw): `!`는 런타임에 사라짐(TS erase) → `null.address`는 TypeError / 렌더 throw는 try 블록 종료 후라 못 잡고 React 내부 함수 스택까지 올라감 / ErrorBoundary 없으면 트리 전체 흰 화면 + 그 이유(반쪽 UI=거짓말, 빈 화면이 더 정직)
- 2026-06-15 — try/catch·`.catch` 에러 채널 정리와 시나리오 실습, ErrorBoundary 진입: `.catch` 실행됨=잡힘=uncaught 아님 / 바깥 try/catch는 데드코드(동기 후 pop) / 두 채널 경계(try/catch=동기, `.catch`=Promise 체인 내부만) / 시나리오3 이벤트 throw 화면 멀쩡(들어낼 UI 없음) / 흰 화면 기준=render경로 vs event경로 / (v1) ErrorBoundary 부모 위치 + React가 `getDerivedStateFromError` 자동 호출
- 2026-06-16 — v1 닫기: 12줄 트릭을 지우면 영원한 로딩(거짓 화면) / `.catch` 안 throw는 Promise 체인에 갇혀 안 닿음 / setState→재렌더→렌더 중 throw로 render 경로에 올려 ErrorBoundary가 잡음 / ErrorBoundary 기준=render 도중(초기든 재렌더든, 재렌더는 비동기 의존 예제의 성질) / static=render 단계 순수 vs componentDidCatch=commit 로깅 / 왜 class 복습(누가 참조를 쥐고 있나)
