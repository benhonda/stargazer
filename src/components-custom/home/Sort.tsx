import { Clickable } from "@/components/Clickable";
import { Icon } from "@/components/Icon";

export function Sort() {
  return (
    <Clickable variant="primary">
      <span>Sort</span>
      <Icon name="chevronDown" strokeWidth={2.5} className="size-4 ml-2" />
    </Clickable>
  );
}
