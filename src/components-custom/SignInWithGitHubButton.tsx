import { Icon } from "@/components/Icon";
import { auth, gitHubProvider } from "@/firebase/client";
import { FirebaseError } from "firebase/app";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

export function SignInWithGitHubButton() {
  async function handleSignInWithGitHub() {
    console.log("Sign in with GitHub");

    try {
      const res = await signInWithPopup(auth, gitHubProvider);

      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(res);
      const token = credential?.accessToken;

      // The signed-in user info.
      const user = res.user;
      // IdP data available using getAdditionalUserInfo(result)

      console.log({ user, token });
    } catch (err) {
      const error = err as FirebaseError;
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);

      console.log({ errorCode, errorMessage, email, credential });

      // ...
    }
  }

  return (
    <button
      type="button"
      className="mt-8 bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-gray-50 border border-gray-700 rounded-md px-3 py-1.5 inline-flex items-center"
      onClick={handleSignInWithGitHub}
    >
      <Icon name="gitHub" className="size-5 mr-2.5" />
      <span>Sign in with GitHub</span>
    </button>
  );
}
