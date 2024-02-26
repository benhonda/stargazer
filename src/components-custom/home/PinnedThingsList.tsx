import { Icon } from "@/components/Icon";

export function PinnedThingsList() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <button
        type="button"
        className="px-2 py-2 inline-flex w-full border-2 border-dashed border-gray-700 hover:border-gray-600 group rounded-md text-gray-500 hover:text-gray-300 text-sm"
      >
        <Icon name="plus" strokeWidth={2.5} className="size-4 mt-[3px] mr-2" />
        <span>Pin a repo or a list</span>
      </button>
    </div>
  );
}
