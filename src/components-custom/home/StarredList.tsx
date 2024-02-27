import { Icon } from "@/components/Icon";
import { computeStarsFromNToMDaysAgo } from "@/utils/github.stars";
import { createNiceNumber } from "@/utils/niceNumbers";
import { $githubStarData, $githubStarDataLoading } from "@/utils/stores";
import { GithubStar } from "@/utils/types.github";
import { useStore } from "@nanostores/react";
import { addDays, format, formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";

export function StarredList(props: { granularity: "this-week" | "this-month" | "past-six-months" | "all-time" }) {
  const _githubStarData = useStore($githubStarData);
  const githubStarDataLoading = useStore($githubStarDataLoading);
  const [stars, setStars] = useState<GithubStar[] | null>(null);

  useEffect(() => {
    // the stars are sorted, so we just need to find the first star that is older than the time we want
    switch (props.granularity) {
      case "this-week":
        setStars(computeStarsFromNToMDaysAgo(_githubStarData, 7));
        break;
      case "this-month":
        setStars(computeStarsFromNToMDaysAgo(_githubStarData, 8, 30));
        break;
      case "past-six-months":
        setStars(computeStarsFromNToMDaysAgo(_githubStarData, 31, 180));
        break;
      default:
        setStars(_githubStarData);
        break;
    }
  }, [props.granularity, _githubStarData]);

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      {githubStarDataLoading ? (
        <>
          <div className="bg-gray-900 border-gray-800 rounded-md aspect-[3/2] animate-pulse"></div>
          <div className="bg-gray-900 border-gray-800 rounded-md aspect-[3/2] animate-pulse"></div>
          <div className="bg-gray-900 border-gray-800 rounded-md aspect-[3/2] animate-pulse"></div>
        </>
      ) : (
        <>
          {stars?.map((star) => {
            return <StarCard key={`star-${star.repo.id}`} star={star} />;
          })}

          {stars?.length === 0 && (
            <div className="col-span-3 text-center">
              <p>No stars found</p>
            </div>
          )}
        </>
      )}
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
          <img
            src={star.repo.owner.avatar_url}
            alt={star.repo.owner.login}
            className="shrink-0 mt-[2.5px] size-5 rounded-full object-contain mr-2.5"
          />

          <a
            href={star.repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block flex-1 space-x-1 text-gray-400"
          >
            <span>{star.repo.owner.login}</span>
            <span>/</span>
            <span className="text-white">{star.repo.name}</span>
          </a>

          <a
            href={star.repo.stargazers_url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 mt-0.5 inline-flex items-center text-gray-500 text-sm"
          >
            <Icon name="star" strokeWidth={2.5} className="shrink-0 size-3.5 mr-1" />
            <span>{createNiceNumber(star.repo.stargazers_count)}</span>
          </a>
        </div>

        {/* desc */}
        <p className="mt-3 text-gray-500 text-sm">{star.repo.description}</p>
      </div>

      {/* pushed to bottom */}
      <div className="shrink-0">
        {/* topics */}
        <div className="relative px-3">
          <div className="mt-4 pb-2 whitespace-nowrap w-full overflow-scroll">
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

          <div className="absolute top-0 right-0 h-8 w-12 bg-gradient-to-r from-transparent to-gray-900"></div>
        </div>

        {/* bottom bar */}
        <div className="mt-3 p-3 flex items-center border-t border-gray-800">
          <div className="flex-1">
            <a href={star.repo.html_url} target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100">
              <Icon name="gitHub" className="size-4 mr-2" />
            </a>
          </div>
          <span className="shrink-0 text-gray-500 text-xs">
            Last commit:{" "}
            <span className="text-gray-300">{formatDistanceToNowStrict(star.repo.pushed_at, { addSuffix: true })}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
