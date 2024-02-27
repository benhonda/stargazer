import { TypesGithubStarAPIResponse } from "./types.github.starApiResponse";

export type GithubStar = {
  repo: TypesGithubStarAPIResponse;
  starred_at: Date;
};
