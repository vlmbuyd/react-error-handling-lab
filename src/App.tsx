import { useState } from 'react';
import { StageV0 } from './stages/v0/StageV0';
import { StageV1 } from './stages/v1/StageV1';
import { StageV2 } from './stages/v2/StageV2';
import { StageV3 } from './stages/v3/StageV3';

type Capability = { label: string; state: 'ok' | 'partial' | 'fail' };

const STAGES = [
  {
    id: 'v0',
    label: 'v0',
    title: 'try/catch 지옥',
    description: '상태 6개, 분기 지옥. 렌더 에러는 화이트스크린으로 끝난다.',
    capabilities: [
      { label: '렌더 에러 포착', state: 'fail' },
      { label: '비동기 에러 포착', state: 'partial' },
      { label: '이벤트 에러 포착', state: 'fail' },
      { label: '로딩 선언화', state: 'fail' },
    ] satisfies Capability[],
    Component: StageV0,
  },
  {
    id: 'v1',
    label: 'v1',
    title: 'ErrorBoundary 직접 구현',
    description: '렌더 에러를 class로 포착. 비동기는 setState 트릭으로 끌어올린다.',
    capabilities: [
      { label: '렌더 에러 포착', state: 'ok' },
      { label: '비동기 에러 포착', state: 'ok' },
      { label: '이벤트 에러 포착', state: 'fail' },
      { label: '로딩 선언화', state: 'fail' },
    ] satisfies Capability[],
    Component: StageV1,
  },
  {
    id: 'v2',
    label: 'v2',
    title: 'showBoundary 패턴',
    description: 'Context + hook으로 비동기 에러 전달을 한 줄로 캡슐화한다.',
    capabilities: [
      { label: '렌더 에러 포착', state: 'ok' },
      { label: '비동기 에러 포착', state: 'ok' },
      { label: '이벤트 에러 포착', state: 'fail' },
      { label: '로딩 선언화', state: 'fail' },
    ] satisfies Capability[],
    Component: StageV2,
  },
  {
    id: 'v3',
    label: 'v3',
    title: 'Suspense + throw promise',
    description: '로딩도 에러도 throw. isLoading 분기가 컴포넌트에서 완전히 사라진다.',
    capabilities: [
      { label: '렌더 에러 포착', state: 'ok' },
      { label: '비동기 에러 포착', state: 'ok' },
      { label: '이벤트 에러 포착', state: 'fail' },
      { label: '로딩 선언화', state: 'ok' },
    ] satisfies Capability[],
    Component: StageV3,
  },
] as const;

const capabilityStyle: Record<Capability['state'], string> = {
  ok:      'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  partial: 'text-amber-400   bg-amber-500/10   border-amber-500/25',
  fail:    'text-zinc-600    bg-zinc-800/60    border-zinc-700/60',
};
const capabilityIcon: Record<Capability['state'], string> = {
  ok: '✓', partial: '△', fail: '✗',
};

export default function App() {
  const [index, setIndex] = useState(0);
  const stage = STAGES[index];

  return (
    <div className="min-h-screen bg-[#0b0b12] font-sans">
      {/* 헤더 */}
      <header className="border-b border-zinc-800/80 px-6 py-5">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-semibold tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase">
                Lab
              </span>
            </div>
            <h1 className="text-lg font-semibold text-zinc-100">React 에러 핸들링</h1>
            <p className="text-xs text-zinc-600 mt-0.5">
              단계별로 에러 핸들링 패턴이 어떻게 진화하는지 실습합니다
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-7 space-y-4">
        {/* 탭 네비게이션 */}
        <nav className="flex gap-1 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800/80">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={[
                'flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-150 cursor-pointer',
                i === index
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60',
              ].join(' ')}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* 단계 정보 */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-5 py-4">
          <p className="font-semibold text-zinc-100 text-sm">{stage.title}</p>
          <p className="mt-0.5 text-xs text-zinc-500 leading-relaxed">{stage.description}</p>

          {/* 능력 매트릭스 */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {stage.capabilities.map((c) => (
              <span
                key={c.label}
                className={[
                  'text-[11px] font-medium px-2 py-0.5 rounded-full border',
                  capabilityStyle[c.state],
                ].join(' ')}
              >
                {capabilityIcon[c.state]} {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* 라이브 데모 */}
        <div
          key={stage.id}
          className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-6 py-5 min-h-32"
        >
          <p className="text-[10px] font-mono text-zinc-700 mb-3 uppercase tracking-wider">
            live demo
          </p>
          <stage.Component />
        </div>
      </div>
    </div>
  );
}
