import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import type { AuthContext } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import SkeletonSearch from "./SkeletonSearch";

async function fetchPosts(
  context: { authContext?: AuthContext },
  inputText: string
) {
  if (!inputText) {
    return { artists: { items: [] } };
  }

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${inputText}&type=artist`,
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
  const queryClient = useQueryClient();
  const context = useRouteContext({ from: "__root__" });
  const [inputText, setInputText] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["searchResults", inputText],
    queryFn: () => fetchPosts(context, inputText),
    staleTime: 10000, // 10 seconds
  });

  useEffect(() => {
    if (inputText) {
      queryClient.fetchQuery({
        queryKey: ["searchResults", inputText],
        queryFn: () => fetchPosts(context, inputText),
      });
    }
  }, [inputText, queryClient]);
  console.log(isLoading);

  return (
    <>
      <section className="flex flex-col bg-radial from-green-900 to-gray-950 to-95%  h-screen max-h-[calc(100vh-41px)] ">
        <div className="py-6 w-1/2 max-w-md align-self-center mx-auto">
          <Input
            className="bg-gray-800 text-gray-200 placeholder:text-gray-400"
            placeholder="Search for an artist..."
            type="text"
            value={inputText}
            onChange={handleInputChange}
          />
        </div>
        {isLoading && <SkeletonSearch />}
        {error && (
          <div className="text-center text-gray-200 h-full flex items-center justify-center">
            <p className="my-auto text-lg font-bold">{error.message}</p>
          </div>
        )}
        {data?.artists.items.length === 0 && (
          <div className="text-center text-gray-200 h-full flex items-center justify-center">
            <p className="my-auto text-lg font-bold">No artists found</p>
          </div>
        )}
        {data?.artists.items.length > 0 && (
          <ul className="flex flex-col items-center gap-8 overflow-y-auto px-2 py-3">
            {data?.artists.items.map((artist: any) => (
              <li key={artist.id} className="w-full max-w-md  rounded-md">
                <Link
                  to={`/artists/${artist.id}`}
                  className="flex items-center  rounded-2xl transition-colors p-2 relative"
                >
                  <img
                    className="aspect-square object-cover rounded-full absolute left-0 top-1/2 transform -translate-y-1/2"
                    src={artist.images[2]?.url}
                    alt={artist.name}
                    width={120}
                    height={120}
                  />
                  <div
                    dir="rtl"
                    className="w-100 font-semibold transition-colors hover:bg-green-900 text-gray-200  bg-gray-800 px-10 py-5 rounded-s-lg ml-20"
                  >
                    <p>{artist.name}</p>
                    <p className="text-sm font-normal text-gray-500">
                      Followers: {artist.followers.total.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default Search;
