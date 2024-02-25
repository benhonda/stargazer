import { logout } from "@/utils/auth.logout";

/**
 * TODO: we'll probably replace this
 */
export function LogoutButton() {
  return (
    <button type="button" onClick={logout}>
      Logout
    </button>
  );
}
