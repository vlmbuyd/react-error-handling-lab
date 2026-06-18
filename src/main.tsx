import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

async function boot() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.ts');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  // ⚠️ App은 MSW가 켜진 '뒤에' 동적 import한다.
  //   v3·use·cache는 promise를 모듈 스코프에서 만든다(render-as-you-fetch).
  //   정적 import면 그 fetch가 worker.start()보다 먼저 터져 index.html이 돌아온다
  //   ("Unexpected token '<'"). 동적 import로 평가 시점을 MSW 준비 후로 미룬다.
  const { default: App } = await import('./App.tsx');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

boot();
