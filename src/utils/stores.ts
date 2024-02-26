import { User } from "@/utils/firestore.types";
import { atom } from "nanostores";
import { User as FirebaseUser } from "firebase/auth";
import { TypesGithubStarAPIResponse } from "./types.github.starApiResponse";

export const $userData = atom<User | null>(null); // stores the user data
export const $githubStarData = atom<TypesGithubStarAPIResponse[] | null>(null); // stores the user data
export const $userFromFirebase = atom<FirebaseUser | null>(null); // stores the firebase user profile
export const $authLoaded = atom(false); // track if auth is loaded
