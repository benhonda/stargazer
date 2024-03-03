import { $searchParams } from "./stores";

export function updateSearchParams(params: Record<string, string | string[]>) {
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

  $searchParams.set(params);
}
