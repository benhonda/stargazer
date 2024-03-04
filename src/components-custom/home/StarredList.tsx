import { Clickable } from "@/components/Clickable";
import { Icon } from "@/components/Icon";
import { computeStarsFromNToMDaysAgo } from "@/utils/github.stars";
import { useGithubStars, useGithubStarsPaginated } from "@/utils/github.swr";
import { createNiceNumber } from "@/utils/niceNumbers";
import {
  $searchParams,
  $starData,
  $starDataSortedAlphabetically,
  $starDataSortedByLeastStars,
  $starDataSortedByMostStars,
  $starDataSortedReverseAlphabetically,
} from "@/utils/stores";
import { SortKeys } from "@/utils/types";
import { GithubStar } from "@/utils/types.github";
import { useStore } from "@nanostores/react";
import { addDays, format, formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";

export function StarredList() {
  const searchParams = useStore($searchParams);
  const { data, isLoading, isValidating, size } = useGithubStarsPaginated();

  const sortKey = (searchParams?.sort as SortKeys) || "created";

  switch (sortKey) {
    case "updated":
      return <ListStars data={data?.flat() || null} isLoading={isLoading} />;
    case "most_stars":
      return <StarsSortedByMostStars />;
    case "least_stars":
      return <StarsSortedByLeastStars />;
    case "alphabetical":
      return <StarsSortedAlphabetically />;
    case "reverse_alphabetical":
      return <StarsSortedReverseAlphabetically />;
    default:
      return (
        <div className="pt-8 space-y-16">
          <StarsInDateRange title="Starred this week" dayRange={[0, 7]} />
          <StarsInDateRange title="Starred this month" dayRange={[8, 30]} />
          <StarsInDateRange title="Starred in the past 6 months" dayRange={[31, 180]} />
          <StarsInDateRange title="Starred in the past year" dayRange={[181, 365]} />
          <StarsInDateRange title="Starred in the past 2 years" dayRange={[366, 730]} />
          <StarsInDateRange title="Starred more than 2 years ago" dayRange={[731]} />
        </div>
      );
  }
}

function StarsSortedByMostStars() {
  const { isLoading } = useGithubStarsPaginated();
  const stardata = useStore($starDataSortedByMostStars);

  return <ListStars data={stardata} isLoading={isLoading} />;
}

function StarsSortedByLeastStars() {
  const { isLoading } = useGithubStarsPaginated();
  const stardata = useStore($starDataSortedByLeastStars);

  return <ListStars data={stardata} isLoading={isLoading} />;
}

function StarsSortedAlphabetically() {
  const { isLoading } = useGithubStarsPaginated();
  const stardata = useStore($starDataSortedAlphabetically);

  return <ListStars data={stardata} isLoading={isLoading} />;
}

function StarsSortedReverseAlphabetically() {
  const { isLoading } = useGithubStarsPaginated();
  const stardata = useStore($starDataSortedReverseAlphabetically);

  return <ListStars data={stardata} isLoading={isLoading} />;
}

function ListStars({ data, isLoading }: { data: GithubStar[] | null; isLoading: boolean }) {
  const isEmpty = data?.length === 0;

  if (!isLoading && isEmpty) return <div></div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-gray-900 border-gray-800 rounded-md aspect-[3/2] animate-pulse"></div>
            ))}
          </>
        ) : (
          <>
            {data?.map((star) => {
              return <StarCard key={`star-${star.repo.id}`} star={star} />;
            })}
          </>
        )}
      </div>
    </div>
  );
}

function StarsInDateRange(props: { title: string; dayRange: [number, number?] }) {
  const { title, dayRange } = props;
  const { data, isLoading, isValidating, size } = useGithubStarsPaginated();

  const [stars, setStars] = useState<GithubStar[] | null>(null);

  useEffect(() => {
    const _githubStarData = data?.flat() || [];
    // the stars are sorted, so we just need to find the first star that is older than the time we want
    setStars(computeStarsFromNToMDaysAgo(_githubStarData, dayRange[0], dayRange[1]));
  }, [dayRange, data]);

  /**
   * Hide the section if we don't have any stars for this time range
   * TODO: this is some kind of weird bug in Astro...
   *    - using client:visible, if I return null or <></> here it will render this component twice,
   *      the first being the unhydrated version and the second being the good one. Returning a div
   *      with no content seems to fix it, but I am still getting a "Hydration failed because the
   *      initial UI does not match what was rendered on the server" console error
   */
  if (!isLoading && !stars) return <div></div>;

  return (
    <div>
      <h2 className="px-4 text-2xl">{title}</h2>

      <div className="mt-4">
        <ListStars data={stars} isLoading={isLoading} />
      </div>
    </div>
  );
}

function StarCard(props: { star: GithubStar }) {
  const { star } = props;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-md flex flex-col">
      <div className="flex-1 p-3">
        {/* top line */}
        <div className="flex items-start">
          <a href={star.repo.owner.html_url} target="_blank" rel="noreferrer" className="shrink-0">
            <img
              src={star.repo.owner.avatar_url}
              alt={star.repo.owner.login}
              className="mt-[2.5px] size-5 rounded-full object-contain mr-2.5"
            />
          </a>

          <span className="inline-block flex-1 text-gray-400 truncate group" title={star.repo.full_name}>
            <a href={star.repo.html_url} target="_blank" rel="noreferrer" className="peer">
              {star.repo.owner.login}
            </a>
            <a href={star.repo.html_url} target="_blank" rel="noreferrer" className="peer">
              {" / "}
            </a>
            <a href={star.repo.html_url} target="_blank" rel="noreferrer" className=" text-white peer">
              {star.repo.name}
            </a>
            <a
              href={star.repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="transition-opacity opacity-0 peer-hover:opacity-100"
            >
              <Icon name="arrowUpRight" className="text-white size-3.5 -mb-0.5 ml-1" strokeWidth={3} />
            </a>
          </span>
        </div>

        {/* desc */}
        <p className="mt-3 text-gray-500 text-sm">{star.repo.description}</p>

        {/* <p className="mt-3 text-gray-500 text-xs">
          Last commit: {formatDistanceToNowStrict(star.repo.pushed_at, { addSuffix: true })}
        </p> */}
      </div>

      {/* pushed to bottom */}
      <div className="shrink-0">
        {/* topics */}
        <div className="relative px-3">
          <div className="mt-4 pb-3 whitespace-nowrap w-full overflow-scroll scrollbar-thin">
            {star.repo.topics.map((topic) => {
              return (
                <span
                  key={`topic-${topic}`}
                  className="inline-block mr-1 text-xs py-0.5 px-1.5 rounded-full border border-primary-500 bg-primary-500/10 text-primary-300"
                >
                  {topic}
                </span>
              );
            })}

            {/* spacer */}
            {star.repo.topics.length > 0 && <span className="inline-block w-6 h-1"></span>}
          </div>

          {star.repo.topics.length > 0 && (
            <div className="absolute top-0 right-0 h-8 w-12 bg-gradient-to-r from-transparent to-gray-900"></div>
          )}
        </div>

        {/* <div className="mt-3 flex items-center">
          <a
            href={star.repo.stargazers_url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center text-gray-500 text-sm"
          >
            <Icon name="star" strokeWidth={2.5} className="shrink-0 size-3.5 mr-1" />
            <span>{createNiceNumber(star.repo.stargazers_count)}</span>
          </a>

          <span className="ml-3 text-gray-500 text-sm">
            Starred {formatDistanceToNowStrict(star.starred_at, { addSuffix: true })}
          </span>
        </div> */}

        {/* bottom bar */}
        <div className="mt-2 p-3 flex items-center border-t border-gray-800">
          <div className="flex-1">
            <a href={star.repo.html_url} target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100">
              <Icon name="gitHub" className="size-4 mr-2" />
            </a>

            <a
              href={star.repo.stargazers_url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center text-gray-500 text-sm"
            >
              <Icon name="star" strokeWidth={2.5} className="shrink-0 size-3.5 mr-1" />
              <span>{createNiceNumber(star.repo.stargazers_count)}</span>
            </a>
          </div>

          <div className="shrink-0 flex flex-col">
            <span className="text-gray-500 text-xs">
              Last commit:{" "}
              <span className="text-gray-400">
                {formatDistanceToNowStrict(star.repo.pushed_at, { addSuffix: true })}
              </span>
            </span>
            {/* <span className="shrink-0 text-gray-500 text-xs">
              Starred {formatDistanceToNowStrict(star.starred_at, { addSuffix: true })}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
