import { QueryDocumentSnapshot, Timestamp, type SnapshotOptions } from "firebase/firestore";
import type { FromFirestore, ToFirestore } from "@/utils/firestore.types";

type DbType<Model> = Model & {
  _id: string;
  _ref: any;
  _created_at: Timestamp;
  _updated_at: Timestamp;
};

/**
 * Firestore converter
 *
 * Using the converter allows you to specify generic type arguments when storing and retrieving objects from Firestore.
 *
 * With help from the example here: https://github.com/CSFrequency/react-firebase-hooks/tree/master/firestore#transforming-data
 *
 * Note: this isn't called for updates, only for reads and writes
 *    see: https://stackoverflow.com/a/75816198/7709846
 */
export function firestoreConverter<Model>() {
  return {
    toFirestore(data: ToFirestore<Model>) {
      // TODO: maybe strip all undefined data here?

      return data;
    },

    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FromFirestore<Model> {
      const data = snapshot.data(options) as DbType<Model>;
      return {
        ...data,
        _id: snapshot.id,
        _ref: snapshot.ref,
        _created_at: data._created_at
          ? typeof data._created_at === "string"
            ? (data._created_at as string)
            : data._created_at.toDate().toString()
          : "",
        _updated_at: data._updated_at
          ? typeof data._updated_at === "string"
            ? (data._updated_at as string)
            : data._updated_at.toDate().toString()
          : "",
      };
    },
  };
}
