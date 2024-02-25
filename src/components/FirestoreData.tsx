import { db } from "@/firebase/client";
import { User } from "@/utils/firestore.types";
import { useDocumentDataStream } from "@/utils/firestore.useDocument";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $userData } from "@/utils/stores";

export function FirestoreData() {
  /**
   * Stores
   */
  // const userData = useStore($userData);

  /**
   * Listen to the user document
   */
  const { data, loading, error } = useDocumentDataStream<User>({
    docRef: doc(db, "users", "ben"),
  });

  console.log({ data, loading, error });

  /**
   * Set the data to the store
   */
  useEffect(() => {
    console.log("render");
    if (!data) return;

    $userData.set(data);
  }, [data]);

  return null;
}
