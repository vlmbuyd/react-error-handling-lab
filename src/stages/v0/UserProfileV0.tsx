// ════════════════════════════════════════════════════════════════
// v0. try/catch 지옥  ─  "에러 핸들링의 출발점"
// ════════════════════════════════════════════════════════════════
// 이 버전엔 🔑 버티는 줄이 '없다'. 교훈은 코드가 아니라 '실패' 그 자체다.
// try/catch만으로 React 에러를 다루려 할 때 무엇이 안 되는지를 몸으로 느끼는 단계.
//
// 🧪 직접 해보기 (3가지 시나리오):
//   1) fetchUser URL에 ?fail=true        → 서버 에러
//   2) fetchUser URL에 ?profileNull=true → 렌더 중 에러
//   3) 아래 "에러 일으키기" 버튼 클릭      → 이벤트 핸들러 에러
import { useEffect, useState } from 'react';
import { fetchUser, fetchPosts } from '../shared/fetchers';
import type { User, Post } from '../shared/types';

export function UserProfileV0() {
  // 🤔 리소스 2개에 상태가 6개다. 이게 왜 문제로 자라날까?
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);
  const [postsError, setPostsError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // 💥 이 try는 fetchUser() 호출 자체의 동기 에러만 잡는다.
      //    fetch가 리턴한 Promise의 rejection은 여기서 절대 안 잡힌다.
      fetchUser()
        .then(setUser)
        .catch(setUserError)
        .finally(() => setIsLoadingUser(false));
    } catch (e) {
      // 💥 사실상 데드 코드 — fetch()는 동기적으로 throw하지 않으므로 여기 안 들어옴.
      setUserError(e as Error);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await fetchPosts(user.id);
        setPosts(data);
      } catch (e) {
        setPostsError(e as Error);
      } finally {
        setIsLoadingPosts(false);
      }
    })();
  }, [user]);

  if (isLoadingUser) return <LoadingSkeleton />;

  if (userError) return (
    <InlineError label="유저 에러" message={userError.message} />
  );

  if (!user) return null;

  return (
    <div className="space-y-5">
      {/* 💥 시나리오2: profile이 null이면 user.profile!.address 접근에서 터진다 — try/catch로 못 잡는 '렌더 중 에러' */}
      <UserCard name={user.name} city={user.profile!.address.city} />

      <button
        onClick={() => { throw new Error('이벤트 핸들러 에러!'); }}
        className="text-xs px-3 py-1.5 rounded-lg border border-red-900/60 bg-red-950/30 text-red-500 hover:bg-red-950/60 transition-colors cursor-pointer"
      >
        ⚡ 에러 일으키기 (이벤트 핸들러)
      </button>

      {/* 🤔 로딩/에러/성공 삼항 분기가 리소스마다 반복된다 — 이 '분기 지옥'을 없앨 길은? (→ v3) */}
      {isLoadingPosts ? (
        <PostsSkeleton />
      ) : postsError ? (
        <InlineError label="게시글 에러" message={postsError.message} />
      ) : (
        <PostsList posts={posts} />
      )}
    </div>
  );
}

// ─── 공용 UI 조각 ────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-800" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-28 rounded bg-zinc-800" />
          <div className="h-3 w-16 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

function PostsSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-3 rounded bg-zinc-800" style={{ width: `${70 + i * 8}%` }} />
      ))}
    </div>
  );
}

function InlineError({ label, message }: { label: string; message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3">
      <span className="text-red-500 mt-0.5 text-sm">⚠</span>
      <div>
        <p className="text-xs font-semibold text-red-400">{label}</p>
        <p className="text-xs text-red-600 mt-0.5">{message}</p>
      </div>
    </div>
  );
}

function UserCard({ name, city }: { name: string; city: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-sm font-semibold text-purple-300">
        {name[0]}
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-100">{name}</p>
        <p className="text-xs text-zinc-500">{city}</p>
      </div>
    </div>
  );
}

function PostsList({ posts }: { posts: Post[] }) {
  return (
    <ul className="space-y-1.5">
      {posts.map((p) => (
        <li key={p.id} className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="text-zinc-700">▸</span>
          {p.title}
        </li>
      ))}
    </ul>
  );
}
