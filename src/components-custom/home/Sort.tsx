import { Clickable } from "@/components/Clickable";
import { Icon } from "@/components/Icon";
import { updateSearchParams } from "@/utils/searchParams";
import { $searchParams } from "@/utils/stores";
import { Listbox, Transition } from "@headlessui/react";
import { useStore } from "@nanostores/react";
import { forwardRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const CustomSortBtn = forwardRef((props, ref: React.Ref<HTMLButtonElement>) => (
  <Clickable variant="primary" buttonRef={ref} {...props} />
));

const sortOptions = [
  { key: "created", label: "Date starred (default)" },
  { key: "updated", label: "Time since last commit" },
  { key: "most_stars", label: "Most stars" },
  { key: "least_stars", label: "Least stars" },
  { key: "alphabetical", label: "Alphabetical" },
  { key: "reverse_alphabetical", label: "Reverse alphabetical" },
];

export function Sort() {
  const searchParams = useStore($searchParams);

  // const currentSort
  const sort = sortOptions.find((p) => p.key === searchParams?.sort) || sortOptions[0];

  return (
    <Listbox as="div" className="relative" value={sort} onChange={(val) => updateSearchParams({ sort: val.key })}>
      <Listbox.Button as={CustomSortBtn}>
        <span>{sort.label}</span>
        <Icon name="chevronDown" strokeWidth={2.5} className="size-4 ml-2" />
      </Listbox.Button>

      <Transition
        // enter="transition duration-100 ease-out"
        // enterFrom="transform scale-95 opacity-0"
        // enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Listbox.Options
          className={
            "absolute z-10 mt-1 w-56 overflow-auto rounded-lg bg-gray-800/60 backdrop-blur-lg p-1 text-base shadow-2xl ring-1 ring-gray-750 focus:outline-none sm:text-sm"
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
                  <Icon
                    name="check"
                    className={twMerge("size-3.5 mr-2 text-white", selected ? "" : "opacity-0")}
                    strokeWidth={2.5}
                  />
                  <span className="">{sortOption.label}</span>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}
