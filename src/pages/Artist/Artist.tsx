import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import type { AuthContext } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

async function fetchMusics(context: { authContext?: AuthContext }, id: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks`,
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

async function fetchArtistAlbums(
  context: { authContext?: AuthContext },
  id: string,
  page: number
) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${id}/albums?offset=${page}&limit=20`,
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

function Artist({ artist }: { artist: any }) {
  const context = useRouteContext({ from: "__root__" });
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  const {
    data: dataMusics,
    error: errorMusics,
    isLoading: isLoadingMusics,
  } = useQuery({
    queryKey: ["artistMusics", artist.id],
    queryFn: () => fetchMusics(context, artist.id),
    staleTime: 10000, // 10 seconds
  });

  const {
    data: dataAlbums,
    error: errorAlbums,
    isLoading: isLoadingAlbums,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["artistAlbums", artist.id, page],
    queryFn: () => fetchArtistAlbums(context, artist.id, page),
    staleTime: 10000, // 10 seconds
  });

  const albumsPages = Math.ceil(dataAlbums?.total / 20) || 1;

  useEffect(() => {
    if (!isPlaceholderData && page < albumsPages - 1) {
      queryClient.prefetchQuery({
        queryKey: ["artistAlbums", artist.id, page + 1],
        queryFn: () => fetchArtistAlbums(context, artist.id, page + 1),
      });
    }
  }, [isPlaceholderData, dataAlbums, page, queryClient]);

  console.log(page);
  return (
    <section className="bg-gray-900 text-white p-6">
      <div className="flex items-center gap-6">
        <img
          className="rounded-md"
          src={artist.images[0]?.url}
          alt={artist.name}
          width={240}
          height={240}
        />
        <div>
          <h1 className="text-2xl font-bold">{artist.name}</h1>
          <p className="text-gray-400">
            <span className="font-bold">Popularity:</span> {artist.popularity}
          </p>
          <p className="text-gray-400">
            <span className="font-bold">Followers:</span>{" "}
            {artist.followers.total}
          </p>
          <p className="text-gray-400">
            <span className="font-bold">Genres:</span>{" "}
            {artist.genres.join(", ")}
          </p>
        </div>
      </div>
      <Tabs defaultValue="top-tracks" className="mt-6">
        <TabsList className="bg-gray-900 w-full gap-1.5">
          <TabsTrigger
            className="text-gray-300"
            style={{ backgroundColor: "var(--color-green-900)" }}
            value="top-tracks"
          >
            Top Tracks
          </TabsTrigger>
          <TabsTrigger
            className="text-gray-300"
            style={{ backgroundColor: "var(--color-green-900)" }}
            value="albums"
          >
            Albums
          </TabsTrigger>
        </TabsList>
        <TabsContent value="top-tracks">
          {isLoadingMusics && <p>Loading top tracks...</p>}
          {errorMusics && (
            <p>Error loading top tracks: {errorMusics.message}</p>
          )}
          <ul className="pl-5 flex flex-col gap-4 my-3">
            {dataMusics?.tracks.map((track: any) => (
              <li
                key={track.id}
                className="flex items-center gap-4 bg-gray-800 rounded-md "
              >
                <img
                  className="rounded-md"
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  width={60}
                  height={60}
                />
                <div>
                  <p className="text-gray-200 font-bold text-lg">
                    {track.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Album: {track.album.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="albums">
          {isLoadingAlbums && <p>Loading albums...</p>}
          {errorAlbums && <p>Error loading albums: {errorAlbums.message}</p>}
          <ul className="pl-5 flex flex-col gap-2 mt-3">
            {dataAlbums?.items.map((album: any) => (
              <li
                key={album.id}
                className="mb-2 flex items-center gap-4 bg-gray-800 rounded-md"
              >
                <img
                  className="rounded-md"
                  src={album.images[0]?.url}
                  alt={album.name}
                  width={60}
                  height={60}
                />
                <div>
                  <p className="text-gray-200 font-bold">{album.name}</p>
                  <p className="text-gray-400 font-sm">
                    Total tracks:{album.total_tracks}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  hidden={page === 0}
                  className="hover:bg-gray-800 cursor-pointer"
                />
              </PaginationItem>
              {albumsPages > 1 &&
                Array.from({ length: albumsPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={index === page}
                      onClick={() => setPage(index)}
                      className="hover:bg-gray-800 cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((old) => (dataAlbums?.next ? old + 1 : old))
                  }
                  hidden={page === albumsPages - 1}
                  className="hover:bg-gray-800 cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default Artist;
