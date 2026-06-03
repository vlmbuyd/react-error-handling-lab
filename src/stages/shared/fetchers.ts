// 💡 fail/profileNull 파라미터를 바꿔가며 실험하세요
//   '/api/user?fail=true'        → 서버 에러
//   '/api/user?profileNull=true' → 렌더 중 에러 (profile이 null)
import type { User, Post } from './types';

export async function fetchUser(): Promise<User> {
  const res = await fetch('/api/user');
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

export async function fetchPosts(userId: number): Promise<Post[]> {
  const res = await fetch(`/api/posts/${userId}`);
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}
