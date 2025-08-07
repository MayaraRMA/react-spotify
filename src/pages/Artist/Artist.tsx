import { useQuery } from "@tanstack/react-query";

async function fetchArtist(id: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function Artist({ id }: { id: number }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["artist", id],
    queryFn: () => fetchArtist(id),
    staleTime: 10000, // 10 seconds
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Count: {data.title}</p>}
    </>
  );
}

export default Artist;
