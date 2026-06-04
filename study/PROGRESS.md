# 학습 진행 상태 (PROGRESS)

> 세션이 바뀌어도 여기를 읽으면 이어갈 수 있다. `/wrap`이 매 세션 끝에 갱신한다.
> **이 파일은 "어디까지 왔나"를 적는 곳이지, 정답을 적는 곳이 아니다.**

## 지금 단계

- **현재 버전**: v0 (진행 중 — 시나리오 1 완료)
- **마지막 세션 날짜**: 2026-06-04
- **다음 세션 시작점**: v0 **시나리오 2**(`?profileNull=true`, 63줄 렌더 중 에러) 예측부터. "이 렌더 에러는 `.catch`나 try/catch가 잡아줄까?"로 시작 → 이어서 시나리오 3(이벤트 핸들러)

## 핵심 질문 3개 — 탐구 상태

> 상태: 🔴 미탐구 / 🟡 탐구중 / 🟢 내 말로 설명 가능

| # | 질문 | 상태 |
|---|------|------|
| 1 | try/catch의 한계 + ErrorBoundary 메커니즘 + 왜 아직 class | 🟡 (비동기 throw를 try/catch가 못 잡는 이유 + `.catch`와의 채널 차이는 자기 말로 설명 가능. 렌더/이벤트 에러 한계, ErrorBoundary는 아직) |
| 2 | Suspensive가 ErrorBoundary·Suspense 위에 더한 것 | 🔴 |
| 3 | 왜 '선언적' 에러 처리인가 + 트레이드오프 | 🔴 |

## 버전별 체크포인트

> "버티는 줄을 지웠을 때 무엇이 어떻게 깨지는지 내 말로 설명 가능" = 그 버전 클리어

- [~] v0 — async rejection을 try/catch가 못 잡는 건 직접 확인 ✅ / 렌더·이벤트 에러는 다음 세션
- [ ] v1 — `throw asyncError` 트릭 + 왜 static/class ErrorBoundary
- [ ] v2 — showBoundary가 v1 트릭을 어떻게 캡슐화했나
- [ ] v3 — throw-promise: 로딩도 에러도 예외라는 관점
- [ ] v4 — hook→컴포넌트, 트리로 표현되는 데이터 의존성

## 아직 열려있는 질문 (다음 세션에 이어서)

- 시나리오 1(비동기 fetch 에러)은 `.catch`로 v0에서 잘 처리됨 — **그럼 v0는 멀쩡한가?**
- 시나리오 2: `?profileNull=true` → `user.profile!.address.city` 렌더 중 에러는 어디서 잡힐까? (예측 전)
- 시나리오 3: 버튼 클릭 이벤트 핸들러 throw는? (예측 전)

## 일지 목록

- 2026-06-04 — v0 시나리오 1: `.then`은 안 기다린다(A,C,B) / 비동기 throw는 try/catch가 못 잡음 / try-catch와 `.catch()`는 다른 채널
