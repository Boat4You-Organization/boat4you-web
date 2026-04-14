import { proxy, useSnapshot } from 'valtio';

interface BlogStore {
  featureBlogId: string | null;
}

export const blogStore = proxy<BlogStore>({
  featureBlogId: null,
});

export const useBlogStore = () => useSnapshot(blogStore) as BlogStore;
