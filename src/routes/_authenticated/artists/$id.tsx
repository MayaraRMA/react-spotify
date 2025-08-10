import Artist from "@/pages/Artist/Artist";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/artists/$id")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const id = params.id;
    const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${context.authContext?.token}`,
      },
    });
    if (!response.ok) throw Error();

    const data = await response.json();
    return { data };
  },
  pendingComponent: () => <div> Loading...</div>,
  errorComponent: () => <div> There was an error!</div>,
});

function RouteComponent() {
  const { data } = useLoaderData({ from: "/_authenticated/artists/$id" });

  return <Artist artist={data} />;
}
