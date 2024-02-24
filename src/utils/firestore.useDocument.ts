import {
  DocumentReference,
  FirestoreError,
  Query,
  SnapshotListenOptions,
  SnapshotOptions,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  onSnapshot,
  queryEqual,
  refEqual,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { FromFirestore } from "./firestore.types";
import { firestoreConverter } from "./firestore.converter";

/**
 * Listen to a document
 */
export function useDocumentDataStream<Model>({
  docRef,
  snapshotOptions,
  snapshotListenOptions,
}: {
  docRef: DocumentReference;
  snapshotOptions?: SnapshotOptions;
  snapshotListenOptions?: SnapshotListenOptions;
}) {
  const [data, setData] = useState<FromFirestore<Model> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  // memoize ref
  const _docRef = useMemoizedDocRef({ docRef });

  useEffect(() => {
    if (!_docRef) {
      setData(undefined);
      return;
    }

    // setLoading(true);
    // const docRefWithConverter = _docRef.withConverter(firestoreConverter<Model>({})) as DocumentReference<
    //   ModelFromFirebase<Model>
    // >;
    const docRefWithConverter = _docRef.withConverter(firestoreConverter<Model>());

    // subscribe to query
    const unsubscribe = onSnapshot(
      docRefWithConverter,
      snapshotListenOptions || {},
      (querySnapshot) => {
        setData(querySnapshot.data(snapshotOptions) as FromFirestore<Model>);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [_docRef, snapshotListenOptions, snapshotOptions]);

  return { data, loading, error };
}

/**
 * Get data from a document once, with ability to reload
 */
export function useDocumentDataOnce<Model>({
  docRef,
  snapshotOptions,
  getFrom = "default",
}: {
  docRef: DocumentReference;
  snapshotOptions?: SnapshotOptions;
  getFrom?: "default" | "server" | "cache";
}) {
  const [data, setData] = useState<FromFirestore<Model> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  // memoize ref
  const _docRef = useMemoizedDocRef({ docRef });

  // load data once function
  const loadData = useCallback(
    async ({ docRef, snapshotOptions }: { docRef: DocumentReference; snapshotOptions?: SnapshotOptions }) => {
      if (!docRef) {
        setData(undefined);
        return;
      }

      setLoading(true);
      const docRefWithConverter = docRef.withConverter(firestoreConverter<Model>());

      try {
        // get data from the right source
        const dataResult =
          getFrom === "server"
            ? await getDocFromServer(docRefWithConverter)
            : getFrom === "cache"
            ? await getDocFromCache(docRefWithConverter)
            : await getDoc(docRefWithConverter);

        // set data
        setData(dataResult.data(snapshotOptions) as FromFirestore<Model>);
      } catch (e) {
        setError(e as FirestoreError);
      }
    },
    [getFrom]
  );

  // reload data once
  const reloadData = useCallback(() => {
    return loadData({ docRef: _docRef, snapshotOptions });
  }, [_docRef, snapshotOptions, loadData]);

  // load data once
  useEffect(() => {
    void loadData({ docRef: _docRef, snapshotOptions });
  }, [_docRef, snapshotOptions, loadData]);

  return { data, loading, error, reloadData };
}

/**
 * Memoize the Query object to prevent infinite useEffect loop
 *
 * Uses React's ref to store the previous query
 */
export function useMemoizedQuery({ query }: { query: Query }) {
  const ref = useRef(query);

  useEffect(() => {
    // compare query, ref.current
    if (!!query && !!ref.current && queryEqual(query, ref.current)) {
      // equal, do nothing
    } else {
      // not equal, run query
      ref.current = query;
      // if (onChange) {
      //   onChange();
      // }
    }
  });

  return ref.current;
}

/**
 * Memoize the DocumentReference object to prevent infinite useEffect loop
 *
 * Uses React's ref to store the previous docRef
 */
export function useMemoizedDocRef({ docRef }: { docRef: DocumentReference }) {
  const ref = useRef(docRef);

  useEffect(() => {
    if (!!docRef && !!ref.current && refEqual(docRef, ref.current)) {
      // equal, do nothing
    } else {
      // not equal, run query
      ref.current = docRef;
    }
  });

  return ref.current;
}
