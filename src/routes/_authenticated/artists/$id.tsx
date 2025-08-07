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
  console.log(data);
  return (
    <div>
      <h1> {data.name}</h1>
      <img
        src={data.images[0]?.url}
        alt={data.name}
        width={data.images[0]?.width}
        height={data.images[0]?.height}
      />
      <p>Followers: {data.followers.total}</p>
      <p>Genres: {data.genres.join(", ")}</p>
      <p>Popularity: {data.popularity}</p>
    </div>
  );
}
