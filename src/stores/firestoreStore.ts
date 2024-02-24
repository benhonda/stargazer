import { User } from "@/utils/firestore.types";
import { atom } from "nanostores";

export const userDataStore = atom<User | null>(null);
