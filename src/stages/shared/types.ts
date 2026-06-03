export type User = {
  id: number;
  name: string;
  profile: { address: { city: string } } | null;
};

export type Post = { id: number; title: string };
