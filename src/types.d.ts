interface SearchResponse {
  artists: {
    href: string;
    items: Artist[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

interface Artist {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  type: string;
  uri: string;
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
  href: string;
  external_urls: {
    spotify: string;
  };
}

interface ArtistAlbumsResponse {
  items: Album[];
  total: number;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
}

interface Album {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  release_date: string;
  total_tracks: number;
  type: string;
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

interface ArtistTopTracksResponse {
  tracks: Track[];
}

interface Track {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
  };
  artists: Artist[];
  popularity: number;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  href: string;
}
