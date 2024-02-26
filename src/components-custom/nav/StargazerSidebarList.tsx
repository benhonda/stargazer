import { Icon } from "@/components/Icon";
import { $userData } from "@/utils/stores";
import { useStore } from "@nanostores/react";

export function StargazerSidebarDirectory() {
  const userData = useStore($userData);

  return (
    <div className="ml-6">
      <button type="button" className="sidebar-item hover:active">
        <Icon name="plus" strokeWidth={2.5} className="sidebar-item-svg mt-[3px] size-4" />
        <span className="text-gray-300">New list</span>
      </button>
    </div>
  );
}
