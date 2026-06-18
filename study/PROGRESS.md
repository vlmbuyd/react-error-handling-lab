# 학습 진행 상태 (PROGRESS)

> 세션이 바뀌어도 여기를 읽으면 이어갈 수 있다. `/wrap`이 매 세션 끝에 갱신한다.
> **이 파일은 "어디까지 왔나"를 적는 곳이지, 정답을 적는 곳이 아니다.**

## 지금 단계

- **현재 버전**: **use → cache → query 사다리 완료**. (use=v3 보일러플레이트 흡수하되 참조 안정은 안 풀어줌 / cache=안에서 만들면 무한 suspend를 네트워크 탭으로 직접 터뜨림 / query=queryKey로 캐시해 props+무한suspend 동시 해결 + 그 위에 정책. "use는 인프라(React), React Query는 정책"까지 자기 말로)
- **마지막 세션 날짜**: 2026-06-18
- **다음 세션 시작점**: (1) 미룬 실험 — `queryKey: ['user', Math.random()]`로 바꿔 매번 캐시 미스 → cache 탭 "깨짐"과 동일함을 직접 확인하고 "queryKey가 안정적이어야 하는 이유"를 한 문장으로. (2) **v4 / Suspensive 본론** — hook을 컴포넌트로(`<SuspenseQuery>`), ErrorBoundaryGroup으로 묶어 데이터 의존성을 트리 구조로 표현. 핵심질문 2의 입구.
- **학습자가 남긴 더 깊은 질문(다음에)**: class 인스턴스 vs 함수형 컴포넌트는 *근본적으로* 뭐가 다르길래 하나는 렌더 중 pop돼 사라지고 하나는 메서드를 기억해 살아남나? ("왜 class"의 한 겹 더 깊은 층)

## 핵심 질문 3개 — 탐구 상태

> 상태: 🔴 미탐구 / 🟡 탐구중 / 🟢 내 말로 설명 가능

| # | 질문 | 상태 |
|---|------|------|
| 1 | try/catch의 한계 + ErrorBoundary 메커니즘 + 왜 아직 class | 🟢 **(완료)** try/catch·`.catch` 한계(두 채널 경계, render vs event 기준) / ErrorBoundary 메커니즘(부모 위치, React가 `getDerivedStateFromError` 자동 호출 → 리턴값 state 병합 → 재렌더 → fallback, ①→②) / **왜 class**(함수는 pop돼 사라지고 인스턴스는 React가 참조로 쥐고 있어 다시 부름) / **v1 12줄 트릭**(비동기 에러를 state에 담고 렌더 중 다시 throw해 render 경로로 끌어올림) / static=render 단계 순수성, `componentDidCatch`=commit 단계 로깅 — 모두 자기 말로. 남은 더 깊은 질문(별개): 인스턴스 vs 함수 근본 차이 |
| 2 | Suspensive가 ErrorBoundary·Suspense 위에 더한 것 | 🟡 **(탐구중)** 토대인 use→cache→query 사다리는 종료(use=인프라/React Query=정책, queryKey=캐시 정체성). 단 Suspensive 본론(hook→컴포넌트 `<SuspenseQuery>`, ErrorBoundaryGroup)은 v4에서 다음에 |
| 3 | 왜 '선언적' 에러 처리인가 + 트레이드오프 | 🔴 |

## 버전별 체크포인트

> "버티는 줄을 지웠을 때 무엇이 어떻게 깨지는지 내 말로 설명 가능" = 그 버전 클리어

- [x] v0 — async rejection을 try/catch가 못 잡는 *왜*(콜스택/마이크로태스크) ✅ / 렌더 throw(시나리오2)→흰 화면+트리 들어내는 이유 ✅ / 이벤트 throw(시나리오3) 화면 멀쩡 이유 ✅ / 두 채널 경계 + 흰 화면 기준(render vs event) 자기 말로 ✅ **— v0 종료**
- [x] v1 — **완료**. ErrorBoundary 구조 + 왜 class / 에러 흐름(getDerivedStateFromError 리턴→state 병합→재렌더→fallback) / **[버티는 줄] 12줄 트릭**(지우면 영원한 로딩 거짓 화면 → 비동기 에러를 state에 담고 렌더 중 다시 throw해 render 경로로 끌어올려 ErrorBoundary가 잡게) / ErrorBoundary 기준=render 도중(초기든 재렌더든) / static=순수(render 단계) vs componentDidCatch=로깅(commit 단계) — 모두 자기 말로
- [x] v2 — **완료**. 에러 state가 자식→ErrorBoundary 단일 소스로 이동 / `showBoundary`=클래스가 만들고 Context로 배달, `useErrorBoundary`=꺼내는 통로 / state가 이미 경계 안에 있으니 throw 없이 setState만으로 fallback / 동기 throw(getDerivedStateFromError)·비동기(showBoundary) 두 경로가 `this.state.error` 하나로 합류 / componentDidCatch=onError 로깅만 / [버티는 줄]=40줄 Provider+31줄 setState (지우면 영원한 로딩 회귀) — 모두 자기 말로
- [x] v3 — **완료**. 로딩도 throw(Promise)·에러도 throw(Error), 받는 쪽은 던진 값의 타입으로 갈림(Promise→Suspense / Error→ErrorBoundary) / `status`·`result`=`createResource`의 클로저 변수(React 주입 ❌, `then` 콜백이 갱신) / 던진 Promise=데이터 운반이 아니라 "끝나면 깨워줘" 재시도 알람(Suspense가 resolve 시 재렌더) / 모듈 스코프 변수는 재렌더 때 초기화 안 됨 → 재시도한 `read()`가 `success` 값 반환 / v3 diff=상태·로딩/에러 UI를 컴포넌트 밖으로 빼 컴포넌트는 성공만 봄 / **[버티는 줄]** read()의 세 갈래(26~28줄) / **한계**=render 바깥은 props 못 봄, render 안은 무한 suspend — 모두 자기 말로
- [x] use → cache → query — **완료**. use=v3 보일러플레이트(`createResource`) 흡수, 동작은 동일(throw로 부모 위임)·표현만 줄음 / cache=promise를 render 안에서 만들면 매 렌더 새 객체 → 무한 suspend(네트워크 탭에 요청 누적)로 직접 터뜨림, 바깥 const는 카드 10개가 한 사람 / query=`queryKey`로 캐시(같은 키=같은 참조)해 props+무한suspend 동시 해결 / **인프라 vs 정책**=use(React)는 던진 promise 처리 기계장치만, React Query는 그 위 캐시·staleTime·retry 정책 / useSuspenseQuery에 isLoading·isError 없음(로딩/에러는 아래 인프라가) — 모두 자기 말로
- [ ] v4 / Suspensive — hook→컴포넌트(`<SuspenseQuery>`), ErrorBoundaryGroup, 트리로 표현되는 데이터 의존성 **(다음 시작점)**

## 아직 열려있는 질문 (다음 세션에 이어서)

- **(다음 시작점 ①) 미룬 실험**: `query/StageQuery.tsx`의 `queryKey`를 `['user', Math.random()]`로 바꾸면 매 렌더 이름표가 달라져 항상 캐시 미스 → 매번 새 요청·suspend → cache 탭 "깨짐"과 동일. 직접 돌려 확인하고 "queryKey가 안정적이어야 하는 이유(같은 데이터=같은 키)"를 한 문장으로.
- **(다음 시작점 ②) v4 / Suspensive 본론**: hook을 컴포넌트로(`<SuspenseQuery>{({data}) => ...}`), `ErrorBoundaryGroup`으로 묶어 한 번에 reset → 데이터 의존성을 트리 구조 그 자체로 표현. 핵심질문 2(Suspensive가 더한 것)의 본론.
- **(역사적 사실, 정리됨)** `createResource`는 실무 best practice였던 적 없음 — React 실험용 데모. 그 시절 best practice는 React Query/SWR(초기엔 Suspense 없이 isLoading 분기). `use()` 훅 React 19(2024) 정식.
- **(맨 후순위, 모든 단계 끝나면 리마인드) 코드 스플리팅(React.lazy)**: 같은 Suspense 엔진에 "데이터 대신 컴포넌트 코드"를 얹은 응용. 전체 끝난 뒤 같은 렌즈로 한 번 훑기.
- **(학습자가 남긴 더 깊은 질문) class 인스턴스 vs 함수형 컴포넌트의 근본 차이**: "class의 인스턴스와 함수형 컴포넌트는 뭐가 다르길래 렌더링 중에 pop되어 없어지거나 그 메서드를 기억해서 살아남나?" — "왜 class"의 한 겹 더 깊은 이유.

## 일지 목록

- 2026-06-04 — v0 시나리오 1: `.then`은 안 기다린다(A,C,B) / 비동기 throw는 try/catch가 못 잡음 / try-catch와 `.catch()`는 다른 채널
- 2026-06-11 — v0 시나리오 1 복습: 콘솔 미니 예제 3개로 then 호출(동기) vs 콜백(마이크로태스크) / try/catch가 스택 pop 후엔 못 잡는 이유 / 두 채널을 자기 말로 재확인 (새 일지 형식: 원문 + 다듬은 정리 + 이해도 점검)
- 2026-06-12 — v0 시나리오 2(렌더 throw): `!`는 런타임에 사라짐(TS erase) → `null.address`는 TypeError / 렌더 throw는 try 블록 종료 후라 못 잡고 React 내부 함수 스택까지 올라감 / ErrorBoundary 없으면 트리 전체 흰 화면 + 그 이유(반쪽 UI=거짓말, 빈 화면이 더 정직)
- 2026-06-15 — try/catch·`.catch` 에러 채널 정리와 시나리오 실습, ErrorBoundary 진입: `.catch` 실행됨=잡힘=uncaught 아님 / 바깥 try/catch는 데드코드(동기 후 pop) / 두 채널 경계(try/catch=동기, `.catch`=Promise 체인 내부만) / 시나리오3 이벤트 throw 화면 멀쩡(들어낼 UI 없음) / 흰 화면 기준=render경로 vs event경로 / (v1) ErrorBoundary 부모 위치 + React가 `getDerivedStateFromError` 자동 호출
- 2026-06-17 — v2 닫기: 에러 state가 자식→ErrorBoundary 단일 소스로 이동(그래서 throw 불필요) / showBoundary=클래스가 만들고 Context로 배달, useErrorBoundary=꺼내는 통로 / 동기 throw(getDerivedStateFromError)·비동기(showBoundary) 두 경로가 this.state.error로 합류 / componentDidCatch=onError 로깅만 / [버티는 줄]=Provider+setState
- 2026-06-17 (이어서) — v3 닫기: 로딩도 throw(Promise)·받는 쪽은 던진 값의 타입으로 갈림 / status=createResource 클로저 변수(then 콜백이 갱신, React 주입 ❌) / 던진 Promise=재시도 알람(Suspense가 resolve 시 재렌더, 모듈 스코프 변수는 초기화 안 됨) / v3 diff=상태·로딩/에러 UI를 컴포넌트 밖으로 / 한계=바깥은 props 못 봄·안은 무한 suspend → v4 캐시 입구
- 2026-06-18 — use→cache→query: use=v3 보일러플레이트 흡수(동작 동일, 표현만 줄음) / cache=render 안에서 만들면 매 렌더 새 promise → 무한 suspend(네트워크 탭 요청 누적), 바깥 const는 카드 10개가 한 사람 / 모듈 스코프 캐싱의 두 한계(props 못 받음·key 부재)와 해법(안에서 호출+key)=useSuspenseQuery / 인프라(use=React) vs 정책(캐시·staleTime·retry=React Query) / fallback 안 떠도 요청 나감=stale-while-revalidate
- 2026-06-16 — v1 닫기: 12줄 트릭을 지우면 영원한 로딩(거짓 화면) / `.catch` 안 throw는 Promise 체인에 갇혀 안 닿음 / setState→재렌더→렌더 중 throw로 render 경로에 올려 ErrorBoundary가 잡음 / ErrorBoundary 기준=render 도중(초기든 재렌더든, 재렌더는 비동기 의존 예제의 성질) / static=render 단계 순수 vs componentDidCatch=commit 로깅 / 왜 class 복습(누가 참조를 쥐고 있나)
