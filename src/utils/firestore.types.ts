import type { DocumentData, DocumentReference, Timestamp, WithFieldValue } from "firebase/firestore";

// when we send data to firestore, we update  _updated_at and maybe _created_at
export type ToFirestore<Model> = WithFieldValue<
  Model & {
    _created_at?: Timestamp;
    _updated_at?: Timestamp;
  }
>;

// when we receive data from firestore, we include _id, _ref, _created_at, and _updated_at
export type FromFirestore<Model> = Model & {
  _id: string;
  _ref: DocumentReference<DocumentData>;
  _created_at: string;
  _updated_at: string;
};

export type User = {
  firstName: string;
  lastName: string;
};
