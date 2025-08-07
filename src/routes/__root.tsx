import type { AuthContext } from "@/hooks/useAuth";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

type RouterContext = {
  authContext?: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link
          to="/artists/$id"
          params={{ id: "4Z8W4fKeB5YxbusRsdQVPb" }}
          className="[&.active]:font-bold"
        >
          Artist
        </Link>{" "}
        <Link to="/search" className="[&.active]:font-bold">
          Search
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
