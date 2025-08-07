import { useQuery } from "@tanstack/react-query";

const fetchToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(
        `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${
          import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
        }`
      )}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch token");
  }
  return response.json();
};

export const useAuth = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["spotifyToken"],
    queryFn: fetchToken,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    token: data?.access_token,
    isLoading,
    error,
  };
};

export type AuthContext = ReturnType<typeof useAuth>;
