import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import type { AuthContext } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";

import { useRouteContext } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import SkeletonSearch from "./components/SkeletonSearch";
import debounce from "@/helpers/debouncer";
import NoDataSearch from "./components/NoDataSearch";
import { ScrollArea } from "@/components/ui/scroll-area";

async function fetchPosts(
  context: { authContext?: AuthContext },
  inputText: string
): Promise<SearchResponse> {
  if (!inputText) {
    return {
      artists: {
        items: [],
        total: 0,
        limit: 0,
        next: null,
        offset: 0,
        previous: null,
        href: "",
      },
    };
  }

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${inputText}&type=album%2Cartist`,
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
  const [debouncedInputText, setDebouncedInputText] = useState("");

  const debouncedSave = useCallback(
    debounce((nextValue: string) => setDebouncedInputText(nextValue), 500),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const clean = DOMPurify.sanitize(event.target.value);

    if (clean === inputText) return;
    setInputText(clean);
    debouncedSave(clean);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["searchResults", debouncedInputText],
    queryFn: () => fetchPosts(context, debouncedInputText),
    staleTime: 10000, // 10 seconds
  });

  useEffect(() => {
    if (debouncedInputText) {
      queryClient.fetchQuery({
        queryKey: ["searchResults", debouncedInputText],
        queryFn: () => fetchPosts(context, debouncedInputText),
      });
    }
  }, [debouncedInputText, queryClient]);

  return (
    <>
      <section className="flex flex-col bg-radial from-green-900 to-gray-950 to-95%  h-screen max-h-[calc(100vh-56px)] p-2">
        <div className="p-6 w-full max-w-md mx-auto">
          <Input
            className="bg-gray-800 text-gray-200 placeholder:text-gray-400"
            placeholder="Search for an artist..."
            type="text"
            value={inputText}
            onChange={handleInputChange}
          />
        </div>
        {isLoading && <SkeletonSearch />}
        {error && <NoDataSearch />}
        {data?.artists.items.length === 0 && <NoDataSearch />}
        {data && data.artists.items.length > 0 && (
          <ScrollArea className="h-[calc(100vh-160px)]">
            <ul className="flex flex-col items-center gap-8  px-2 py-3">
              {data?.artists.items.map((artist) => (
                <li key={artist.id} className="w-full max-w-md rounded-md">
                  <Link
                    to="/artists/$id"
                    params={{ id: artist.id }}
                    className="flex items-center  rounded-2xl transition-colors p-2 relative"
                  >
                    <img
                      className="aspect-square object-cover rounded-full absolute left-0 top-1/2 transform -translate-y-1/2 drop-shadow-lg drop-shadow-green-500/50"
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
          </ScrollArea>
        )}
      </section>
    </>
  );
}

export default Search;
