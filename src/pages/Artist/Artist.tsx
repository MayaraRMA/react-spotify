import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import type { AuthContext } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const [albumsPages, setAlbumsPages] = useState(0);
  const [arrayToRender, setArrayToRender] = useState<number[]>([]);
  const [cutPages, setCutPages] = useState<number[]>([]);

  const handleSlicePages = (
    newPage: number,
    albumsArray: number[] = arrayToRender
  ) => {
    if (albumsPages <= 5) {
      setCutPages(albumsArray);
    }
    const start = Math.max(0, newPage - 2);
    const end = Math.min(albumsArray.length, start + 5);
    setCutPages(albumsArray.slice(start, end));
  };

  const handlePagesChange = (newPage: number) => {
    setPage(newPage);
    handleSlicePages(newPage);
  };

  useEffect(() => {
    if (dataAlbums) {
      const albumsPages = Math.ceil(dataAlbums.total / 20);
      const albumsArray = Array.from({ length: albumsPages }, (_, i) => i);
      setAlbumsPages(albumsPages);
      setArrayToRender(albumsArray);
      handleSlicePages(page, albumsArray);
    }
  }, [dataAlbums?.total]);
  useEffect(() => {
    if (!isPlaceholderData && page < albumsPages - 1) {
      queryClient.prefetchQuery({
        queryKey: ["artistAlbums", artist.id, page + 1],
        queryFn: () => fetchArtistAlbums(context, artist.id, page + 1),
      });
    }
  }, [isPlaceholderData, dataAlbums, page, queryClient]);

  return (
    <section className="bg-gray-900 text-white flex flex-col items-center p-4 gap-4 min-h-[calc(100vh-56px)]">
      <div className="flex flex-wrap gap-6 max-w-3xl w-full">
        <img
          className="rounded-md drop-shadow-lg drop-shadow-green-500/50"
          src={artist.images[0]?.url}
          alt={artist.name}
          width={200}
          height={200}
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">{artist.name}</h1>
          <p className="text-gray-400">
            <span className="font-bold">Popularity:</span> {artist.popularity}
          </p>
          <p className="text-gray-400">
            <span className="font-bold">Followers:</span>{" "}
            {artist.followers.total}
          </p>
          {artist.genres.length > 0 && (
            <p className="text-gray-400 text-wrap max-w-md">
              <span className="font-bold">Genres:</span>{" "}
              {artist.genres.join(", ")}
            </p>
          )}
        </div>
      </div>
      <Tabs defaultValue="top-tracks" className="w-full max-w-3xl">
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
          {isLoadingMusics && <p className="h-120">Loading top tracks...</p>}
          {errorMusics && (
            <p className="h-120">
              Error loading top tracks: {errorMusics.message}
            </p>
          )}
          <ScrollArea className="h-120">
            <ul className="flex flex-col gap-4 my-3">
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
          </ScrollArea>
        </TabsContent>
        <TabsContent value="albums">
          {isLoadingAlbums && <p className="h-120">Loading albums...</p>}
          {errorAlbums && (
            <p className="h-120">Error loading albums: {errorAlbums.message}</p>
          )}
          <ScrollArea className="h-120">
            <ul className="flex flex-col gap-2 mt-3">
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
          </ScrollArea>
          {cutPages.length > 0 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePagesChange(Math.max(page - 1, 0))}
                    hidden={page === 0}
                    className="hover:bg-gray-800 cursor-pointer"
                  />
                </PaginationItem>

                {cutPages.map((item) => (
                  <PaginationItem key={item}>
                    <PaginationLink
                      isActive={item === page}
                      onClick={() => handlePagesChange(item)}
                      className="hover:bg-gray-800 cursor-pointer"
                    >
                      {item + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {page < albumsPages - 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis
                        onClick={() =>
                          handlePagesChange(
                            Math.min(page + 10, albumsPages - 1)
                          )
                        }
                      />
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePagesChange(Math.min(page + 1, albumsPages - 1))
                    }
                    hidden={page === albumsPages - 1}
                    className="hover:bg-gray-800 cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default Artist;
