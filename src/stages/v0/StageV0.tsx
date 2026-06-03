// 🤔 v1~v3과 달리 여기엔 감싸는 경계가 '아무것도 없다'. 안전망 없는 맨몸 상태.
//    → 렌더 에러가 나면 그대로 화이트스크린. 이 부재가 v1을 부르는 출발점.
import { UserProfileV0 } from './UserProfileV0';

export function StageV0() {
  return <UserProfileV0 />;
}
