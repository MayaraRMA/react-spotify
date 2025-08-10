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
      <div className="p-2 flex gap-2 bg-green-950">
        <Link to="/search" className="[&.active]:font-bold ">
          <p className="text-gray-200">Find Artists</p>
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
