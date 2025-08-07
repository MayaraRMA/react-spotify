import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

async function fetchPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function Search() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 10000, // 10 seconds
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Count: {data.length}</p>}
    </>
  );
}

export default Search;
