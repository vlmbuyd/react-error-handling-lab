// StageV1과 모양은 같다. 달라진 건 자식(UserProfileV2)이 에러를 넘기는 '방식'뿐.
import { ErrorBoundaryV2, ErrorFallback } from './ErrorBoundaryV2';
import { UserProfileV2 } from './UserProfileV2';

export function StageV2() {
  return (
    <ErrorBoundaryV2 FallbackComponent={ErrorFallback}>
      <UserProfileV2 />
    </ErrorBoundaryV2>
  );
}
