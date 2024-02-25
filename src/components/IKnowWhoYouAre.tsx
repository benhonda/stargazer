import { $userData, $userFromFirebase } from "@/utils/stores";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

export function IKnow() {
  const userData = useStore($userData);
  const user = useStore($userFromFirebase);

  console.log({ userData, user });

  const [testHydration, setTestHydration] = useState("default");

  useEffect(() => {
    setTestHydration("hydrated");
  }, []);

  if (!userData) {
    return (
      <>
        <p>I don't know who you are...</p>
        <p>{testHydration}</p>
      </>
    );
  }

  return (
    <>
      <p>I know who you are...</p>
      <p>You're {userData.firstName}</p>
    </>
  );
}
