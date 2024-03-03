import { Clickable } from "@/components/Clickable";
import { PAGE_SIZE, useGithubStarsPaginated } from "@/utils/github.swr";

/**
 * This component is responsible for loading more GitHub stars
 * Tap into the data elsewhere with the useGithubStarsPaginated hook
 */
export function GitHubStarsLoadMore() {
  const { data, isLoading, isValidating, size, setSize } = useGithubStarsPaginated();

  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && data && data.length === size;

  if (isReachingEnd) return null;
  return (
    <Clickable type="button" variant="primary" onClick={() => setSize(size + 1)} disabled={isLoading || isValidating}>
      {isLoadingMore ? "Loading..." : "Load more"}
    </Clickable>
  );
}
