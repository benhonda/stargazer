import { Icon } from "@/components/Icon";
import { logout } from "@/utils/auth.logout";

/**
 * TODO: we'll probably replace this
 */
export function LogoutButton() {
  return (
    <button type="button" className="sidebar-item hover:active" onClick={logout}>
      <Icon name="logout" className="sidebar-item-svg rotate-180" />
      <span>Logout</span>
    </button>
  );
}
