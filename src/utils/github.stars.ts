import { isBefore, subDays } from "date-fns";
import { GithubStar } from "./types.github";

/**
 * Get the stars from the last N to M days ago
 * I.e. if N = 7 and M = 14, it will return the stars from 7 days ago to 14 days ago
 * @param data
 * @param earlierStop
 * @param laterStop
 * @returns
 */
export function computeStarsFromNToMDaysAgo(data: GithubStar[] | null, earlierStop: number, laterStop?: number) {
  if (!data) return null;
  if (laterStop && laterStop < earlierStop) throw new Error("laterStop must be greater than or equal to earlierStop");

  const today = new Date();
  // if laterStop is not provided, we will only get the stars from earlierStop days ago to today
  let earlierStopDate = today;
  let laterStopDate = subDays(today, earlierStop);

  // if laterStop is provided, we will get the stars from earlierStop days ago to laterStop days ago
  if (laterStop) {
    earlierStopDate = subDays(today, earlierStop);
    laterStopDate = subDays(today, laterStop);
  }

  let startSliceIndex = null;
  let endSliceIndex = data.length;
  for (let i = 0; i < data.length; i++) {
    const star = data[i];
    const starredAtDate = new Date(star.starred_at);

    if (isBefore(starredAtDate, earlierStopDate) && startSliceIndex === null) {
      startSliceIndex = i;
    }

    if (isBefore(starredAtDate, laterStopDate)) {
      endSliceIndex = i;
      break;
    }
  }

  return data.slice(startSliceIndex || 0, endSliceIndex);
}
