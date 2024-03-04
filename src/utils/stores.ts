import { User } from "@/utils/firestore.types";
import { atom, batched, computed, map, onMount } from "nanostores";
import { User as FirebaseUser } from "firebase/auth";
import { GithubStar } from "./types.github";
import { subDays, isAfter, isBefore } from "date-fns";
import { SortKeys } from "./types";

export const $userData = atom<User | null>(null); // stores the user data
export const $userFromFirebase = atom<FirebaseUser | null>(null); // stores the firebase user profile
export const $authLoaded = atom(false); // track if auth is loaded

export const $starData = atom<GithubStar[] | null>(null); // stores the user data
export const $starDataKey = atom<string | null>(null); // stores the key that swr uses to fetch the star data

export const $starDataSortedByMostStars = computed($starData, (data) => {
  console.log("sorting by most stars");
  if (!data) return null;
  // don't mutate the original array
  return data.slice().sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count);
});

export const $starDataSortedByLeastStars = computed($starData, (data) => {
  console.log("sorting by least stars");
  if (!data) return null;
  return data.slice().sort((a, b) => a.repo.stargazers_count - b.repo.stargazers_count);
});

export const $starDataSortedAlphabetically = computed($starData, (data) => {
  console.log("sorting alphabetically");
  if (!data) return null;
  return data.slice().sort((a, b) => a.repo.name.localeCompare(b.repo.name));
});

export const $starDataSortedReverseAlphabetically = computed($starData, (data) => {
  console.log("sorting reverse alphabetically");
  if (!data) return null;
  return data.slice().sort((a, b) => b.repo.name.localeCompare(a.repo.name));
});

export const $searchParams = atom<Record<string, string | string[]> | null>(null); // stores the search params

/**
 * TODO: filter computation using topics + keywords from repo description
 */
