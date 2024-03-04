import { Clickable } from "@/components/Clickable";
import { Icon } from "@/components/Icon";
import { MAX_PAGES, useGithubStarsPaginated } from "@/utils/github.swr";
import { updateSearchParams } from "@/utils/searchParams";
import { $searchParams } from "@/utils/stores";
import { SortKeys } from "@/utils/types";
import { Listbox, Transition } from "@headlessui/react";
import { useStore } from "@nanostores/react";
import { forwardRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const CustomSortBtn = forwardRef((props, ref: React.Ref<HTMLButtonElement>) => (
  <Clickable variant="primary" buttonRef={ref} {...props} />
));

type SortOption = { key: SortKeys; label: string };

const sortOptions: SortOption[] = [
  { key: "created", label: "Date starred (default)" },
  { key: "updated", label: "Last commit time" },
  { key: "most_stars", label: "Most stars" },
  { key: "least_stars", label: "Least stars" },
  { key: "alphabetical", label: "Alphabetical" },
  { key: "reverse_alphabetical", label: "Reverse alphabetical" },
];

export function Sort() {
  const searchParams = useStore($searchParams);
  const { isLoading, isLoadingMore, size, setSize } = useGithubStarsPaginated();
  const [transitionToSortKey, setTransitionToSortKey] = useState<SortKeys | null>(null); // if this is set, it means we are loading all data

  const sort = sortOptions.find((p) => p.key === searchParams?.sort) || sortOptions[0];

  function handleSortChange(sort: SortOption) {
    // we don't need to load all data if...
    //  - sort.key is "created" or "updated"
    //  - we have already loaded all data
    if (sort.key === "created" || sort.key === "updated" || size === MAX_PAGES) {
      return updateSearchParams({ sort: sort.key });
    }

    setSize(MAX_PAGES); // load all data
    setTransitionToSortKey(sort.key);
  }

  /**
   * basically wait for the data to load, then update the search params
   *
   * this would actually be done in a useEffect in the useGithubStarsPaginated hook, but
   * for better UX, we want to load and then transition instead of transitioning and then loading
   */
  useEffect(() => {
    if (!transitionToSortKey) return;
    if (size !== MAX_PAGES) return;
    if (isLoading || isLoadingMore) return;

    updateSearchParams({ sort: transitionToSortKey });

    setTransitionToSortKey(null);
  }, [transitionToSortKey, size, isLoading, isLoadingMore]);

  return (
    <Listbox as="div" className="relative" value={sort} onChange={handleSortChange}>
      {({ open }) => (
        <>
          <Listbox.Button as={CustomSortBtn}>
            <span>{sort.label}</span>
            <Icon name="chevronDown" strokeWidth={2.5} className="size-4 ml-2" />
          </Listbox.Button>

          <Transition
            show={open || transitionToSortKey !== null}
            enter="transition ease-out duration-200"
            enterFrom="translate-y-1"
            enterTo="translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            // enter="transition duration-100 ease-out"
            // enterFrom="transform scale-95 opacity-0"
            // enterTo="transform scale-100 opacity-100"
            // leave="transition duration-75 ease-out"
            // leaveFrom="transform scale-100 opacity-100"
            // leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options
              static
              className={
                "absolute left-0 -translate-x-1 z-20 mt-1.5 w-56 overflow-auto rounded-lg bg-gray-800/60 backdrop-blur-lg p-1 text-base shadow-2xl ring-1 ring-gray-750 focus:outline-none sm:text-sm"
              }
            >
              {sortOptions.map((sortOption) => (
                <Listbox.Option
                  key={sortOption.key}
                  value={sortOption}
                  className={({ active }) =>
                    twMerge(
                      `relative flex items-center cursor-default select-none px-2 py-1.5 rounded-md`,
                      active ? "bg-white/10" : ""
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className="inline-block size-3.5 mr-2 text-white">
                        {transitionToSortKey === sortOption.key ? (
                          <Icon name="spinner" className={twMerge("size-full text-white")} strokeWidth={3} />
                        ) : selected ? (
                          <Icon name="check" className={"size-full text-white"} strokeWidth={2.5} />
                        ) : null}
                      </span>

                      <span className="">{sortOption.label}</span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
}
