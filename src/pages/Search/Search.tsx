import type { AuthContext } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

import { useRouteContext } from "@tanstack/react-router";

async function fetchPosts(context: { authContext?: AuthContext }) {
  const response = await fetch(
    "https://api.spotify.com/v1/search?q=taylor&type=artist",
    {
      headers: {
        Authorization: `Bearer ${context.authContext?.token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function Search() {
  const context = useRouteContext({ from: "__root__" });
  const { data, error, isLoading } = useQuery({
    queryKey: ["searchResults"],
    queryFn: () => fetchPosts(context),
    staleTime: 10000, // 10 seconds
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Count: {data.artists.total}</p>}
      <ul>
        {data?.artists.items.map((artist: any) => (
          <li key={artist.id}>
            <img
              src={artist.images[2]?.url}
              alt={artist.name}
              width={artist.images[2]?.width}
              height={artist.images[2]?.height}
            />
            <a href={`/artists/${artist.id}`}>{artist.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Search;
