import { Clickable } from "@/components/Clickable";
import { Icon } from "@/components/Icon";
import { MAX_PAGES, useGithubStarsPaginated } from "@/utils/github.swr";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, forwardRef, useEffect } from "react";

const CustomSortBtn = forwardRef((props, ref: React.Ref<HTMLButtonElement>) => (
  <Clickable variant="primary" buttonRef={ref} {...props} />
));

export function Filter() {
  return (
    <Popover className={"relative"}>
      <Popover.Button as={CustomSortBtn}>
        <span>Filter</span>
        <Icon name="chevronDown" strokeWidth={2.5} className="size-4 ml-2" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        {/* <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl"> */}
        <div>
          <PopoverContent />
        </div>
      </Transition>
    </Popover>
  );
}

function PopoverContent() {
  const { isLoading, isLoadingMore, size, setSize } = useGithubStarsPaginated();

  /**
   * Immediately get all data
   */
  useEffect(() => {
    if (size === MAX_PAGES) return;
    setSize(MAX_PAGES);
  }, [size, setSize]);

  return (
    <Popover.Panel className="absolute left-0 -translate-x-1 z-10 mt-1.5 w-96 px-4 sm:px-0 ">
      <div className="overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/5">
        <div className="relative bg-gray-800/60 backdrop-blur-lg p-4">Hello</div>
      </div>
    </Popover.Panel>
  );
}
