// v4 데모를 탭에 띄우기 위한 래퍼.
// AppV4(트리 버전)를 QueryClientProvider로 감싼다 — query 단계와 동일하게 캐시가 필요하므로.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppV4 } from './AppV4';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

export function StageV4() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppV4 />
    </QueryClientProvider>
  );
}
