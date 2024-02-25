import { auth } from "@/firebase/client";
import { signOut } from "firebase/auth";

export async function logout() {
  try {
    await signOut(auth);

    console.log("logout success");
  } catch (error) {
    console.error("logout error", error);
  }
}
