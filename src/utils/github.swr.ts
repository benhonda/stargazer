import { Endpoints } from "@octokit/types";
import { Octokit } from "octokit";
import { GithubStar } from "./types.github";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { $searchParams } from "./stores";

const octokit = new Octokit({ auth: import.meta.env.PUBLIC_GITHUB_PAT });

export async function octokitFetcher(url: string) {
  // url can contain a page query param
  // const response = (await octokit.rest.activity.listReposStarredByAuthenticatedUser({
  //   per_page: 30,
  //   // sort: "created",
  //   headers: {
  //     "X-GitHub-Api-Version": "2022-11-28",
  //     accept: "application/vnd.github.star+json",
  //   },
  // })) as unknown as GithubStar[]; // we have to cast it b/c we're using application/vnd.github.star+json and it doesn't know that

  console.info("fetching", url);

  const response = await octokit.request(`GET ${url}`, {
    // per_page: 30,
    // sort: "created", // options: created (date starred) or updated (last push)
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

export const PAGE_SIZE = 40;

function getKey(pageIdx: number, prevPageData: GithubStar[] | null, sort: "created" | "updated" = "created") {
  if (prevPageData && !prevPageData.length) return null; // reached the end
  return `/user/starred?per_page=${PAGE_SIZE}&page=${pageIdx + 1}&sort=${sort}`; // SWR key
}

export function useGithubStarsPaginated() {
  const searchParams = useStore($searchParams);
  const sort = searchParams?.sort === "updated" ? "updated" : "created";

  // equivalent to useSWRImmutable https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
  const res = useSWRInfinite((pageIdx, prevPageData) => getKey(pageIdx, prevPageData, sort), octokitFetcher, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    parallel: true,
  });

  return res;
}

/**
 * Parse the data from the GitHub API response
 * Taken from https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28
 * @param data
 * @returns
 */
// function parseData(data: any) {
//   // If the data is an array, return that
//   if (Array.isArray(data)) {
//     return data;
//   }

//   // Some endpoints respond with 204 No Content instead of empty array
//   //   when there is no data. In that case, return an empty array.
//   if (!data) {
//     return [];
//   }

//   // Otherwise, the array of items that we want is in an object
//   // Delete keys that don't include the array of items
//   delete data.incomplete_results;
//   delete data.repository_selection;
//   delete data.total_count;
//   // Pull out the array of items
//   const namespaceKey = Object.keys(data)[0];
//   data = data[namespaceKey];

//   return data;
// }

// const octokit = new Octokit({ auth: import.meta.env.PUBLIC_GITHUB_PAT });

// const data = await octokit.paginate<GithubStar>({
//   method: "GET",
//   url: "/user/starred",
//   headers: {
//     "X-GitHub-Api-Version": "2022-11-28",
//     accept: "application/vnd.github.star+json",
//   },
//   per_page: 100, // gets 100 repos per page
//   sort: "updated",
// });
