import { userDataStore } from "@/stores/firestoreStore";
import { useStore } from "@nanostores/react";

export function IKnow() {
  const $userData = useStore(userDataStore);

  if (!$userData) {
    return (
      <>
        <p>I don't know who you are...</p>
      </>
    );
  }

  return (
    <>
      <p>I know who you are...</p>
      <p>You're {$userData.firstName}</p>
    </>
  );
}
