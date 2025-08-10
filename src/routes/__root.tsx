import type { AuthContext } from "@/hooks/useAuth";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";

type RouterContext = {
  authContext?: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <nav className="p-2 flex gap-2 bg-green-950">
        <Link
          to="/"
          className="[&.active]:font-bold hover:bg-green-800 p-2 rounded-md"
        >
          <p className="text-gray-200">Home</p>
        </Link>
        <Link
          to="/search"
          className="[&.active]:font-bold hover:bg-green-800 p-2 rounded-md"
        >
          <p className="text-gray-200">Find Artists</p>
        </Link>
      </nav>
      <Outlet />
    </>
  ),
});
