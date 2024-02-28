import { useState, useEffect } from "react";

/**
 * Hook to get and set URLSearchParams
 * @returns [searchParams, updateSearchParams]
 */
export function useURLSearchParams(): [
  Record<string, string | string[]>,
  (params: Record<string, string | string[]>) => void
] {
  const [searchParams, setSearchParams] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string | string[]> = {};

    urlSearchParams.forEach((value, key) => {
      if (params[key]) {
        if (Array.isArray(params[key])) {
          (params[key] as string[]).push(value);
        } else {
          params[key] = [params[key] as string, value];
        }
      } else {
        params[key] = value;
      }
    });

    setSearchParams(params);
  }, []);

  const updateSearchParams = (params: Record<string, string | string[]>) => {
    const urlSearchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => urlSearchParams.append(key, v));
      } else {
        urlSearchParams.set(key, value);
      }
    });

    const newSearchString = urlSearchParams.toString();
    const newURL = `${window.location.pathname}?${newSearchString}`;

    window.history.replaceState(null, "", newURL);
    setSearchParams(params);
  };

  return [searchParams, updateSearchParams];
}
