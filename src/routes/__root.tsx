import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link
          to="/artists/$id"
          params={{ id: "1" }}
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
