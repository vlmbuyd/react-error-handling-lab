# React 에러 핸들링 Lab 

> `try/catch → ErrorBoundary → Suspense(throw-promise) → Suspensive`
> React가 **'에러'와 '로딩'이라는 두 비정상 상태**를 어떻게 다뤄왔는지, 그 진화 과정을
> 단계별 코드로 **직접 부수고 복원하며** 깨닫는 딥다이브 실습 저장소.

## 왜 이 프로젝트인가

지금까지 에러는 "ErrorBoundary로 감싸면 됨", 로딩은 "isLoading 분기" 정도로 **패턴만 외워** 써왔다.
그런데 막상:

- 왜 `try/catch`로는 React의 비동기·렌더 에러를 못 잡는가?
- ErrorBoundary는 왜 React 19에서도 여전히 **class** 컴포넌트여야 하는가?
- Suspense의 fallback은 **어떤 메커니즘**으로 뜨는가? (`throw promise`?)
- Suspensive는 그 위에 **무엇을** 더했는가?

이 질문들에 **근거 있게** 답할 수 있게 되는 것이 목표다.

### 끝까지 파고들 핵심 질문 3개

1. 왜 `try/catch`만으론 React 에러를 못 다루고, ErrorBoundary는 정확히 어떤 메커니즘으로 그 틈을 메우나? (그리고 왜 아직 class인가)
2. Suspensive는 ErrorBoundary·Suspense 위에 **무엇을** 더했나?
3. React는 왜 에러 핸들링을 **'선언적'**으로 가져가려 하나? 그 트레이드오프는?

## 단계 (src/stages)

| 단계 | 주제 | 한 줄 |
|------|------|-------|
| **v0** | try/catch 지옥 | 상태 6개·분기 지옥. 비동기 rejection도 렌더 에러도 못 잡음 |
| **v1** | ErrorBoundary 직접 구현 | 비동기 에러를 state에 담아 **렌더에서 다시 throw**하는 트릭 |
| **v2** | showBoundary 패턴 | v1의 트릭을 **Context + hook 한 줄**로 캡슐화 |
| **v3** | Suspense + throw-promise | 로딩도 에러도 throw → **isLoading 분기가 사라짐** |
| **use** | React 19 `use()` | `createResource.read()`의 세 갈래를 한 줄이 흡수. 단, 참조는 여전히 사용자 몫 |
| **cache** | 캐시 문제 시각화 | render 안에서 promise를 만들면 매 렌더 새 참조 → 무한 suspend |
| **query** | `useSuspenseQuery` | queryKey로 promise 캐시 → 참조 안정. **use는 인프라, RQ는 정책** |
| **v4** | Suspensive 스타일 | hook을 컴포넌트로 → 데이터 의존성을 **트리 구조**로 표현 (의사코드) |

각 단계는 브라우저 상단 탭(v0~v3·use·cache·query)으로 전환하며 실행해볼 수 있다. (v4는 의사코드 읽기 자료)

## 학습 방식 — "읽고 끝"이 아니라 "부수고 복원"

답이 이미 코드에 다 들어있다. 그래서 베끼지 않고, 아래 루프로 **직접 깨닫는다**:

```
① 예측  실행 전에 "이 시나리오에서 뭐가 일어날까?"를 먼저 적는다
② 실행  npm run dev 로 직접 돌려 관찰한다
③ 비교  예측과 결과의 '틈'을 파고든다  ← 여기서 배움이 일어난다
④ 버티는 줄  그 버전의 핵심 1~2줄을 지워보고 → 무엇이 깨지는지 보고 → 복원한다
⑤ 한 문장  "이전 버전이 못 풀던 무슨 문제를, 이게 어떻게 풀었나?"
```

### 코드 주석 범례

소스 곳곳에 학습용 마커가 박혀 있다:

```
🔑 [버티는 줄]  지우면 이 버전의 존재 이유가 무너지는 핵심 줄
🧪 직접 해보기   지우거나 바꿔서 돌려보면 깨닫는 실험
💥 여기서 터진다  실제로 에러가 발생하는 지점
🤔             스스로 '네 말로' 답해볼 질문 (정답은 코드에 적지 않음)
```

> 코드 주석은 **따라갈 수 있는 메커니즘(무엇을 하는가)** 까지만 알려준다.
> **"왜 그렇게 진화했나 / 트레이드오프"는 직접 깨달아야 할 몫**으로 남겨 둔다.

### 3가지 실패 시나리오 (모든 버전에 던진다)

| # | 트리거 | 본질 |
|---|--------|------|
| 1 | `fetchUser` URL에 `?fail=true` | 비동기 **rejection** |
| 2 | `?profileNull=true` → `profile!.address` | 렌더 중 **throw** |
| 3 | "에러 일으키기" 버튼 클릭 | 라이프사이클 **밖**의 throw (ErrorBoundary도 못 잡는 함정) |

자세한 예측표·참조표는 [`study/scenarios.md`](study/scenarios.md).

## 실행

```bash
npm install
npm run dev      # vite — 브라우저에서 v0~v3·use·cache·query 탭 전환하며 실험
```

실패는 `src/stages/shared/fetchers.ts`의 URL에 쿼리를 붙이거나
[`src/mocks/handlers.ts`](src/mocks/handlers.ts)(MSW)를 참고해 유도한다.

## Claude Code와 함께 학습하기

이 저장소는 **세션이 끊겨도 이어서** 학습하도록 하네스가 구성돼 있다.

| 경로 | 역할 |
|------|------|
| `CLAUDE.md` | 매 세션 자동 로드. 학습 규칙(절대 먼저 답하지 않음) + 이어가기 방법 |
| `study/PROGRESS.md` | 진도표 — 지금 어느 단계·어떤 질문 탐구 중·다음 시작점 |
| `study/scenarios.md` | 실패 시나리오 + 버전별 '버티는 줄' 참조표 |
| `study/journal/` | 세션별 **'내가 스스로 깨달은 것'** 일지 (원문 보존, 노션 이동용) |

### 스킬

- **`/dive`** — 소크라테스식 학습 대화 시작/재개. 답을 떠먹이지 않고 질문으로 유도한다.
- **`/wrap`** — 세션 마무리. 내가 스스로 깨달은 부분만 원문 그대로 일지에 기록하고 진도표를 갱신한다.

```bash
/dive    # 공부 시작 (또는 "이어서 하자")
/wrap    # 오늘 여기까지 — 깨달음 정리
```

---

### 기술 스택

React 19 · TypeScript · Vite · MSW (목 서버) · Tailwind
