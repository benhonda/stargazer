import { Endpoints } from "@octokit/types";
import { Octokit } from "octokit";
import { GithubStar } from "./types.github";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $searchParams, $starData, $starDataKey } from "./stores";
import { SortKeys } from "./types";

const octokit = new Octokit({ auth: import.meta.env.PUBLIC_GITHUB_PAT });

export async function octokitFetcher(url: string) {
  console.info("fetching", url);

  const response = await octokit.request(`GET ${url}`, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
      accept: "application/vnd.github.star+json",
    },
  });

  return response.data as GithubStar[];
}

export function useGithubStars(props?: { page?: number; perPage?: number; sort?: "created" | "updated" }) {
  const { page = 1, perPage = 30, sort = "created" } = props || {};

  const res = useSWR(`/user/starred?per_page=${perPage}&page=${page}&sort=${sort}`, octokitFetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  return res;
}

export const PAGE_SIZE = 42;
// this is the max number of stars we can fetch. Not for any technical reason, just because we need a number to
// pass to the useSWRInfinite hook when we want to fetch all the stars (i.e. when we are sorting/filtering)
export const MAX_PAGES = Math.floor(1000 / PAGE_SIZE);

function getKey(pageIdx: number, prevPageData: GithubStar[] | null, sort: "created" | "updated" = "created") {
  if (prevPageData && !prevPageData.length) return null; // reached the end
  return `/user/starred?per_page=${PAGE_SIZE}&page=${pageIdx + 1}&sort=${sort}`; // SWR key
}

export function useGithubStarsPaginated() {
  const searchParams = useStore($searchParams);
  const sortParam = searchParams?.sort as SortKeys;
  const sort = searchParams?.sort === "updated" ? "updated" : "created";

  // equivalent to useSWRImmutable https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
  const res = useSWRInfinite((pageIdx, prevPageData) => getKey(pageIdx, prevPageData, sort), octokitFetcher, {
    // revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    parallel: true,
    // initialSize: sortParam === "created" || sortParam === "updated" ? 1 : MAX_PAGES,
    initialSize: 1,
  });

  /**
   * Set size to MAX_PAGES to load all data if sortParam is not "created" or "updated"
   */
  useEffect(() => {
    if (!sortParam || sortParam === "created" || sortParam === "updated") return;
    if (res.size === MAX_PAGES) return;

    res.setSize(MAX_PAGES);
  }, [sortParam, res.size]);

  /**
   * send data to store
   * I need to do this because we have computed stores that depend on the star data
   */
  useEffect(() => {
    if (!res.data) return;

    // TODO: NOTE: this seems to work for our purposes, but it will not allow data to be refreshed
    const fetchKey = getKey(res.size - 1, null, sort);
    if ($starDataKey.get() === fetchKey) return;

    // set the key so we can check if we need to update the store
    $starDataKey.set(fetchKey);
    // set the data
    $starData.set(res.data.flat());
  }, [res.data]);

  const isLoadingMore = res.isLoading || (res.size > 0 && res.data && typeof res.data[res.size - 1] === "undefined");
  const isEmpty = res.data?.[0]?.length === 0;
  const isRefreshing = res.isValidating && res.data && res.data.length === res.size;

  return { ...res, isLoadingMore, isEmpty, isRefreshing };
}
