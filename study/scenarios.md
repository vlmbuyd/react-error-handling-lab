# 실험 시나리오 & 버전별 "버티는 줄" 참조표

## 📖 코드 주석 범례 (소스에 공통으로 박혀 있음)

```
🔑 [버티는 줄]  이 줄을 지우면 이 버전의 존재 이유가 무너진다 (= 핵심)
🧪 직접 해보기   지우거나 바꿔서 돌려보면 깨닫는 실험
🤔             /dive에서 '네 말로' 답해볼 질문 (정답은 코드에 적지 않음)
```

> 코드에는 **따라갈 수 있는 메커니즘(무엇을 하는가)** 만 주석으로 적혀 있고,
> **"왜 그렇게 진화했나 / 트레이드오프"는 🤔 질문으로만** 남겨 둔다. 그 답은 `/dive`에서 스스로 말한다.

---

> 이 파일은 `/dive`가 질문 소재(probe)를 길어 올리는 우물이다.
> 학습자에게 **답을 보여주는 용도가 아니라**, "이 시나리오를 직접 돌려보고 예측과 비교해보자"고
> 유도하기 위한 참조다. 핵심 결론은 학습자가 말하게 한다.

## 3가지 실패 시나리오 (모든 버전에 공통으로 던진다)

| # | 이름 | 트리거 | 본질 |
|---|------|--------|------|
| 1 | 서버 에러 | `fetchUser` URL에 `?fail=true` (또는 `handlers.ts`가 500 반환) | 비동기 **rejection** |
| 2 | 렌더 에러 | `?profileNull=true` → `profile!.address.city` 접근에서 터짐 | 렌더 도중 **throw** |
| 3 | 이벤트 핸들러 에러 | 버튼 `onClick`에서 `throw` | React 라이프사이클 **밖**의 throw |

### 예측표 (학습자가 실행 전에 직접 채운다)

각 칸에 실행 **전** 예측을 적고, 실행 후 결과와 비교한다.
질문 프레임: *화이트스크린? fallback 뜸? 콘솔만? 복구(reset) 가능?*

|        | 시나리오1 (서버에러) | 시나리오2 (렌더에러) | 시나리오3 (핸들러에러) |
|--------|------|------|------|
| v0     |      |      |      |
| v1     |      |      |      |
| v2     |      |      |      |
| v3     |      |      |      |
| v4     |      |      |      |

> 시나리오 3은 좋은 함정이다: **ErrorBoundary로 감싸도 이벤트 핸들러의 throw는 안 잡힌다.**
> → 워크시트의 "선언적 에러 처리의 트레이드오프" 질문과 직접 연결.

## 버전별 "버티는 줄(load-bearing line)"

각 버전을 *그 버전답게* 만드는 최소 핵심 줄. `/dive`에서 "이 줄을 지우면 뭐가 깨질까?"로 묻는다.
전체를 베끼지 말고 **이 줄만 비웠다가 직접 복원**하는 게 핵심 연습.

- **v0** (`v0/UserProfileV0.tsx`) — 버티는 줄이 *없는 게* 교훈. `try`가 감싼 `fetchUser()`의
  Promise rejection은 `catch`로 안 잡힘(사실상 데드코드). 렌더 에러도 못 잡음.
- **v1** (`v1/UserProfileV1.tsx`) — `if (asyncError) throw asyncError;` + `.catch(setAsyncError)`
  → 비동기 에러를 setState에 담아 **다음 렌더에서 다시 throw**, 동기 경계를 넘기는 트릭.
  (`v1/ErrorBoundaryV1.tsx`의 `static getDerivedStateFromError` — 왜 static·class여야 하나?)
- **v2** (`v2/ErrorBoundaryV2.tsx` + `useErrorBoundary.ts`) — `showBoundary = (e) => setState({error:e})`
  → v1의 "state에 담아 throw" 트릭을 Context+hook으로 캡슐화. 사용처는 `.catch(showBoundary)` 한 줄.
- **v3** (`v3/createResource.ts`) — `read()`의 `throw promise`(pending) / `throw result`(error)
  → React에겐 **로딩도 에러도 똑같이 예외**. Promise를 throw하면 Suspense가, Error면 ErrorBoundary가 잡는다.
- **v4** (`v4/AppV4.tsx`, 의사코드) — hook을 컴포넌트로: `<SuspenseQuery>{({data}) => ...}`,
  `ErrorBoundaryGroup`으로 묶어 한 번에 reset → 데이터 의존성을 **트리 구조 그 자체**로 표현.

## 핵심 질문 3개 (워크시트 출처 — 이게 학습의 종착점)

1. 왜 `try/catch`만으론 React 에러를 못 다루고, ErrorBoundary는 정확히 어떤 메커니즘으로 그 틈을 메우나? (그리고 왜 아직 class인가)
2. Suspensive는 ErrorBoundary·Suspense 위에 **무엇을** 더했나?
3. React는 왜 에러 핸들링을 '선언적'으로 가져가려 하나? 그 트레이드오프는?
