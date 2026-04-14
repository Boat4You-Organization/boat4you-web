import { blogStore } from './blog.store';

export function selectFeatureBlog(featureBlogId: string): void {
  blogStore.featureBlogId = featureBlogId;
}
