# 학습 진행 상태 (PROGRESS)

> 세션이 바뀌어도 여기를 읽으면 이어갈 수 있다. `/wrap`이 매 세션 끝에 갱신한다.
> **이 파일은 "어디까지 왔나"를 적는 곳이지, 정답을 적는 곳이 아니다.**

## 지금 단계

- **현재 버전**: **v4 / Suspensive 완료 — 버전 사다리(v0→v4) 졸업.** 핵심질문 2·3·B를 자기 말로 닫음. (v4=hook을 컴포넌트로(`<SuspenseQuery>`) 바꿔 데이터 의존·로딩/에러 경계를 트리로 선언 / 분리하면 hook도 입자도 가능하고 SuspenseQuery는 그 분리를 트리에 inline으로 추상화 / 선언적=How 숨기고 What 노출, "읽는 쪽 명시성 + 쓰는 쪽 단순함" / 트레이드오프 2개 / IOC 착시까지 자기 말로)
- **큰 제목 확정**: "React가 비동기를 선언적으로 다루기까지 — try/catch에서 Suspensive까지" (에러 핸들링이 아니라 비동기 상태를 선언적으로 들어내기)
- **마지막 세션 날짜**: 2026-06-19
- **다음 세션 시작점**: 남은 심화 probe 두 개. (A) ErrorBoundary는 왜 *하필* class인가 — 전역 컨텍스트 대신 트리 위치를 가진 class인 이유(학습자의 "인스턴스 vs 함수 근본 차이"와 한 묶음, 세션 1개). (C) 한 컴포넌트에서 여러 Promise를 던지면 Suspense가 어떻게 구분하나(Suspense가 정말 구분하나? 정체성은 queryKey 층, 짧은 세션). 그 외 미룬 `Math.random` 실험, React.lazy 보너스.
- **학습자가 남긴 더 깊은 질문(probe A와 함께)**: class 인스턴스 vs 함수형 컴포넌트는 *근본적으로* 뭐가 다르길래 하나는 렌더 중 pop돼 사라지고 하나는 메서드를 기억해 살아남나? ("왜 class"의 한 겹 더 깊은 층)

## 핵심 질문 3개 — 탐구 상태

> 상태: 🔴 미탐구 / 🟡 탐구중 / 🟢 내 말로 설명 가능

| # | 질문 | 상태 |
|---|------|------|
| 1 | try/catch의 한계 + ErrorBoundary 메커니즘 + 왜 아직 class | 🟢 **(완료)** try/catch·`.catch` 한계(두 채널 경계, render vs event 기준) / ErrorBoundary 메커니즘(부모 위치, React가 `getDerivedStateFromError` 자동 호출 → 리턴값 state 병합 → 재렌더 → fallback, ①→②) / **왜 class**(함수는 pop돼 사라지고 인스턴스는 React가 참조로 쥐고 있어 다시 부름) / **v1 12줄 트릭**(비동기 에러를 state에 담고 렌더 중 다시 throw해 render 경로로 끌어올림) / static=render 단계 순수성, `componentDidCatch`=commit 단계 로깅 — 모두 자기 말로. 남은 더 깊은 질문(별개): 인스턴스 vs 함수 근본 차이 |
| 2 | Suspensive가 ErrorBoundary·Suspense 위에 더한 것 | 🟢 **(완료)** hook(useSuspenseQuery)→컴포넌트(`<SuspenseQuery>`)로 데이터 가져오기가 트리 노드가 됨 → 의존·로딩/에러 경계를 트리 모양으로 읽음 / 분리하면 hook도 입자도 가능, SuspenseQuery는 그 분리를 inline 추상화 / ErrorBoundaryGroup=묶어서 한 번에 reset — 자기 말로 |
| 3 | 왜 '선언적' 에러 처리인가 + 트레이드오프 | 🟢 **(완료)** 왜 선언적=자식은 성공만 집중(로딩/에러는 경계 위임)→자식 단순+의존/경계 한눈에 / 선언적=How 숨기고 What 노출, "읽는 쪽 명시성+쓰는 쪽 단순함" / 트레이드오프 ①선언적 경계는 렌더 도중 에러만 덮음→이벤트·렌더밖 비동기는 명령형 병행(하나의 모델 불가) ②결과가 정상 vs fallback 둘뿐→세밀한 처리는 명령형이 유리 — 자기 말로 |

## 발표 후 받은 질문 (워크시트 종착점에 연결 — 기본개념 끝나면 내 말로 답할 수 있어야)

> 2026-06-19 발표 후 받은 질문 3개. 모두 핵심질문 1·2·3의 *심화*다. 답은 여기 적지 않는다(/dive에서 스스로).

| # | 받은 질문 | 연결 | 다룰 때 짚을 각도 |
|---|-----------|------|-------------------|
| A | ErrorBoundary가 **왜 하필 class**인가 — 콜스택 문제는 전역 컨텍스트 등 다른 방법으로도 풀 수 있었을 텐데? | 핵심질문 1 심화 + 학습자가 남긴 "인스턴스 vs 함수 근본 차이" | 전역 컨텍스트로 가면 *어느 트리가 망가졌고 어디에 fallback을 그릴지* 위치 정보가 빠짐 → 왜 트리 위치를 가진 컴포넌트여야 했나 |
| B | 에러를 **부모에게 위임**하는 게 하향식 데이터 흐름과 반대되는 IOC(의존성 역전) 아닌가? | **핵심질문 3 정문** | 🟢 **(닫음 2026-06-19)** IOC는 착시 — throw는 원래 콜스택 위로 감(새롭지 않음). React가 새로 한 건 "어디서 받을지를 트리 위치로 선언". 콜스택 호출자 = 트리 부모(맥락 쥔 쪽이 받음) — 자기 말로 |
| C | 한 컴포넌트에서 **여러 종류의 Promise를 던지면 Suspense가 어떻게 구분**하나? | 핵심질문 2·3 + Suspense/캐시 경계 | 전제를 깨는 게 포인트: Suspense는 개별 promise를 "구분"하지 않음(받으면 settle까지 대기·재렌더 시 또 throw). "여러 데이터 구별"은 캐시(queryKey)의 몫 |

## 버전별 체크포인트

> "버티는 줄을 지웠을 때 무엇이 어떻게 깨지는지 내 말로 설명 가능" = 그 버전 클리어

- [x] v0 — async rejection을 try/catch가 못 잡는 *왜*(콜스택/마이크로태스크) ✅ / 렌더 throw(시나리오2)→흰 화면+트리 들어내는 이유 ✅ / 이벤트 throw(시나리오3) 화면 멀쩡 이유 ✅ / 두 채널 경계 + 흰 화면 기준(render vs event) 자기 말로 ✅ **— v0 종료**
- [x] v1 — **완료**. ErrorBoundary 구조 + 왜 class / 에러 흐름(getDerivedStateFromError 리턴→state 병합→재렌더→fallback) / **[버티는 줄] 12줄 트릭**(지우면 영원한 로딩 거짓 화면 → 비동기 에러를 state에 담고 렌더 중 다시 throw해 render 경로로 끌어올려 ErrorBoundary가 잡게) / ErrorBoundary 기준=render 도중(초기든 재렌더든) / static=순수(render 단계) vs componentDidCatch=로깅(commit 단계) — 모두 자기 말로
- [x] v2 — **완료**. 에러 state가 자식→ErrorBoundary 단일 소스로 이동 / `showBoundary`=클래스가 만들고 Context로 배달, `useErrorBoundary`=꺼내는 통로 / state가 이미 경계 안에 있으니 throw 없이 setState만으로 fallback / 동기 throw(getDerivedStateFromError)·비동기(showBoundary) 두 경로가 `this.state.error` 하나로 합류 / componentDidCatch=onError 로깅만 / [버티는 줄]=40줄 Provider+31줄 setState (지우면 영원한 로딩 회귀) — 모두 자기 말로
- [x] v3 — **완료**. 로딩도 throw(Promise)·에러도 throw(Error), 받는 쪽은 던진 값의 타입으로 갈림(Promise→Suspense / Error→ErrorBoundary) / `status`·`result`=`createResource`의 클로저 변수(React 주입 ❌, `then` 콜백이 갱신) / 던진 Promise=데이터 운반이 아니라 "끝나면 깨워줘" 재시도 알람(Suspense가 resolve 시 재렌더) / 모듈 스코프 변수는 재렌더 때 초기화 안 됨 → 재시도한 `read()`가 `success` 값 반환 / v3 diff=상태·로딩/에러 UI를 컴포넌트 밖으로 빼 컴포넌트는 성공만 봄 / **[버티는 줄]** read()의 세 갈래(26~28줄) / **한계**=render 바깥은 props 못 봄, render 안은 무한 suspend — 모두 자기 말로
- [x] use → cache → query — **완료**. use=v3 보일러플레이트(`createResource`) 흡수, 동작은 동일(throw로 부모 위임)·표현만 줄음 / cache=promise를 render 안에서 만들면 매 렌더 새 객체 → 무한 suspend(네트워크 탭에 요청 누적)로 직접 터뜨림, 바깥 const는 카드 10개가 한 사람 / query=`queryKey`로 캐시(같은 키=같은 참조)해 props+무한suspend 동시 해결 / **인프라 vs 정책**=use(React)는 던진 promise 처리 기계장치만, React Query는 그 위 캐시·staleTime·retry 정책 / useSuspenseQuery에 isLoading·isError 없음(로딩/에러는 아래 인프라가) — 모두 자기 말로
- [x] v4 / Suspensive — **완료**. hook(useSuspenseQuery)→컴포넌트(`<SuspenseQuery>`)로 데이터 가져오기가 트리 노드가 됨 → 의존·로딩/에러 경계를 트리 모양으로 읽음 / 한 컴포넌트에 hook 몰면 한 덩어리, 자식으로 분리하면 hook도 입자도 가능(단 자식 컴포넌트 손수 작성+props), SuspenseQuery는 그 분리를 inline 추상화 / 선언적=How 숨기고 What 노출("읽는 쪽 명시성+쓰는 쪽 단순함") / ErrorBoundaryGroup=묶어 한 번에 reset / 트레이드오프 2개(렌더 도중만/세밀 처리 불리) / IOC 착시 — 모두 자기 말로. **앱 탭에도 추가**(`v4/StageV4.tsx`=QueryClientProvider로 AppV4 감쌈, `.Reset`→`.Consumer`로 수정)

## 아직 열려있는 질문 (다음 세션에 이어서)

- **(다음 시작점 ①) 심화 A — 세션 1개**: ErrorBoundary는 왜 *하필* class인가? 콜스택 문제만 푸는 거라면 전역 컨텍스트 같은 다른 설계도 가능했을 텐데, 왜 트리 위치를 가진 class 컴포넌트였나? (전역 컨텍스트면 *어느 트리가 망가졌고 어디에 fallback을 그릴지* 위치 정보가 빠짐.) 학습자의 "인스턴스 vs 함수 근본 차이"와 한 묶음.
- **(다음 시작점 ②) 심화 C — 짧은 세션**: 한 컴포넌트에서 여러 종류의 Promise를 던지면 Suspense가 어떻게 구분하나? (전제 의심: Suspense가 정말 구분하나? 받으면 settle까지 대기·재렌더 시 또 throw. 여러 데이터의 정체성은 캐시=queryKey 층의 몫.)
- **(미룬 실험)**: `query/StageQuery.tsx`의 `queryKey`를 `['user', Math.random()]`로 바꾸면 매 렌더 이름표가 달라져 항상 캐시 미스 → 매번 새 요청·suspend → cache 탭 "깨짐"과 동일. 직접 돌려 확인하고 "queryKey가 안정적이어야 하는 이유(같은 데이터=같은 키)"를 한 문장으로.
- **(역사적 사실, 정리됨)** `createResource`는 실무 best practice였던 적 없음 — React 실험용 데모. 그 시절 best practice는 React Query/SWR(초기엔 Suspense 없이 isLoading 분기). `use()` 훅 React 19(2024) 정식.
- **(맨 후순위, 모든 단계 끝나면 리마인드) 코드 스플리팅(React.lazy)**: 같은 Suspense 엔진에 "데이터 대신 컴포넌트 코드"를 얹은 응용. 전체 끝난 뒤 같은 렌즈로 한 번 훑기.
- **(학습자가 남긴 더 깊은 질문) class 인스턴스 vs 함수형 컴포넌트의 근본 차이**: "class의 인스턴스와 함수형 컴포넌트는 뭐가 다르길래 렌더링 중에 pop되어 없어지거나 그 메서드를 기억해서 살아남나?" — "왜 class"의 한 겹 더 깊은 이유.

## 일지 목록

- 2026-06-04 — **v0: 왜 try/catch가 비동기 에러를 못 잡나(첫 관찰)** — `.then` 콜백은 동기 코드가 다 끝난 뒤에 실행돼 출력 순서가 A→C→B가 된다 / 그래서 비동기 안에서 throw해도 try/catch는 이미 빠져나온 뒤라 못 잡는다 / try/catch(동기용)와 `.catch()`(Promise용)는 서로 다른 에러 통로임을 처음 구분
- 2026-06-11 — **v0 복습: "스택에서 빠져나온 뒤라 못 잡는다"를 미니 예제로 확인** — 콘솔 예제 3개로 then 호출(동기) vs 콜백(마이크로태스크) 타이밍을 눈으로 확인 / try/catch가 콜스택 pop 후엔 에러를 못 잡는 이유를 직접 재현 / 두 에러 통로를 자기 말로 재정리 (이때부터 일지 형식 = 원문 + 다듬은 정리 + 이해도 점검)
- 2026-06-12 — **v0: 렌더링 중 에러가 나면 화면이 통째로 하얘지는 이유** — TS의 `!`는 컴파일하면 사라져서(타입 지움) `null.address` 접근 시 런타임 TypeError 발생 / 이 에러는 렌더 함수 종료 후 React 내부 스택까지 올라가 바깥 try/catch로 못 잡음 / ErrorBoundary가 없으면 트리 전체가 흰 화면 — 반쪽 UI(거짓말)보다 빈 화면이 더 정직하다
- 2026-06-15 — **두 에러 통로 정리 + ErrorBoundary 첫 등장** — `.catch`가 실행됐다 = 잡혔다 = uncaught 아님 / 그 바깥 try/catch는 동기 코드라 이미 pop돼 사실상 죽은 코드 / 통로 경계 명확화(try/catch=동기, `.catch`=Promise 체인 안에서만) / 이벤트 핸들러에서 throw하면 화면 멀쩡(들어낼 렌더 결과가 없으니까) / 흰 화면 기준 = 렌더 경로냐 이벤트 경로냐 / ErrorBoundary는 부모에 두고, React가 `getDerivedStateFroㅌmError`를 자동 호출함을 확인
- 2026-06-16 — **v1 완료: 비동기 에러를 렌더 경로로 끌어올려 ErrorBoundary에 잡히게 하는 트릭** — 핵심 12줄을 지우면 에러가 안 닿아 영원히 로딩(거짓 화면) / `.catch` 안에서 그냥 throw하면 Promise 체인에 갇혀 ErrorBoundary까지 못 감 / 그래서 에러를 state에 담고 → setState → 재렌더 → 렌더 도중 다시 throw → 그제서야 render 경로라 ErrorBoundary가 잡음 / ErrorBoundary가 잡는 기준 = 렌더 도중(초기든 재렌더든) / `static getDerivedStateFromError`=렌더 단계(순수) vs `componentDidCatch`=커밋 단계(로깅) / "왜 class인가" 복습(누가 인스턴스 참조를 쥐고 있나)
- 2026-06-17 — **v2 완료: 흩어진 에러 state를 ErrorBoundary 한 곳으로 모으기** — 에러 state가 자식에서 ErrorBoundary로 올라가 단일 소스가 됨(그래서 더는 throw할 필요 없이 setState만으로 fallback) / `showBoundary`=클래스가 만들어 Context로 배달하는 손잡이, `useErrorBoundary`=그 손잡이를 꺼내 쓰는 통로 / 동기 throw(getDerivedStateFromError)와 비동기(showBoundary) 두 경로가 결국 `this.state.error` 하나로 합류 / `componentDidCatch`는 onError 로깅 전용 / [버티는 줄]=Provider + setState
- 2026-06-17 (이어서) — **v3 완료: 로딩도 "throw"로 처리한다 — Suspense의 정체** — 로딩은 Promise를 throw, 에러는 Error를 throw → 받는 쪽이 던져진 값의 타입을 보고 갈라짐(Promise→Suspense, Error→ErrorBoundary) / `status`·`result`는 `createResource`의 클로저 변수(React가 주입하는 게 아니라 then 콜백이 갱신) / 던져진 Promise = 데이터 운반이 아니라 "끝나면 깨워줘" 재시도 알람(Suspense가 resolve되면 재렌더) / 모듈 스코프 변수는 재렌더해도 초기화 안 됨 → 재시도한 read()가 성공값 반환 / 한계 = 컴포넌트 바깥이라 props를 못 받고, 안에서 만들면 무한 로딩 → v4 캐시로 넘어가는 입구
- 2026-06-18 — **use → cache → query: 보일러플레이트를 걷어내고 캐시·정책을 분리** — `use`=v3의 createResource 보일러플레이트를 흡수(동작은 동일, 코드만 짧아짐) / 직접 캐시: Promise를 렌더 안에서 만들면 매 렌더마다 새 객체라 무한 로딩(네트워크 탭에 요청이 계속 쌓임) — 바깥 const로 빼면 카드 10개가 한 사람만 보는 문제 / 모듈 스코프 캐싱의 두 한계(props 못 받음·키 없음)와 그 해법(컴포넌트 안에서 호출 + queryKey) = `useSuspenseQuery` / 역할 분리: 인프라(던진 promise 처리 = React)와 정책(캐시·staleTime·retry = React Query) / fallback 안 떠도 뒤에서 요청은 나감 = stale-while-revalidate
- 2026-06-19 — **v4(Suspensive) 완료 + 핵심질문 2·3·B를 내 말로 닫기** — hook(useSuspenseQuery)→컴포넌트(`<SuspenseQuery>`)로 데이터 가져오기가 트리 노드가 됨 → 의존·로딩/에러 경계를 트리 모양으로 읽음 / 한 컴포넌트에 hook 몰면 한 덩어리, 자식으로 분리하면 hook도 먼저 온 것부터 보여줄 수 있음(단 자식 컴포넌트 손수 작성+props), `<SuspenseQuery>`는 그 분리를 트리에 inline 추상화 / 선언적=How 숨기고 What 노출("읽는 쪽 명시성 + 쓰는 쪽 단순함") / 트레이드오프 ①선언적 경계는 렌더 도중 에러만 덮음→이벤트·렌더밖 비동기는 명령형 병행 ②결과가 정상 vs fallback 둘뿐→세밀한 처리는 명령형 유리 / B: 부모 위임이 IOC처럼 보이는 건 착시 — throw는 원래 콜스택 위로 감, React가 새로 한 건 "어디서 받을지를 트리 위치로 선언"(콜스택 호출자=트리 부모)
