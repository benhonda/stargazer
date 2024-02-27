import { User } from "@/utils/firestore.types";
import { atom, computed } from "nanostores";
import { User as FirebaseUser } from "firebase/auth";
import { GithubStar } from "./types.github";
import { subDays, isAfter, isBefore } from "date-fns";

export const $userData = atom<User | null>(null); // stores the user data
export const $userFromFirebase = atom<FirebaseUser | null>(null); // stores the firebase user profile
export const $authLoaded = atom(false); // track if auth is loaded

export const $githubStarData = atom<GithubStar[] | null>(null); // stores the user data
export const $githubStarDataLoading = atom(true); // track if the github star data is loading

// export const $githubStarDataThisWeek = computed($githubStarData, (data) => computeStarsInLastNDays(data, 7));
// export const $githubStarDataThisMonth = computed($githubStarData, (data) => computeStarsInLastNDays(data, 30));
// export const $githubStarDataPastSixMonths = computed($githubStarData, (data) => computeStarsInLastNDays(data, 180));
