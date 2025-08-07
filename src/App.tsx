import "./App.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./hooks/useAuth";

const router = createRouter({
  routeTree,
  context: { authContext: undefined! },
  defaultNotFoundComponent: () => <div>Global Not Found :(</div>,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const authContext = useAuth();
  return (
    <>
      <RouterProvider router={router} context={{ authContext }} />
    </>
  );
}

export default App;
