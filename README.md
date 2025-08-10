# React Spotify

A modern web application that integrates with the Spotify API to provide music discovery, playlist management, and playback features using React.

## Features

- Spotify authentication (OAuth)
- Browse and search for artists
- Responsive UI

## Getting Started

### Prerequisites

- Node.js (v20.19+)
- npm
- Spotify Developer account

### Installation

```bash
git clone https://github.com/yourusername/react-spotify.git
cd react-spotify
npm install
```

### Setup

1. Register your app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create a `.env` file in the root directory:

```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Running the App

```bash
npm run dev
```

## Usage

- Log in with your Spotify account.
- Search for artists and see their top tracks and albuns.

## Technologies

- React
- Spotify Web API
- Fetch
- Tanstack/react-query
- Tanstack/react-router
- Tailwindcss

## License

MIT

---

_This project is not affiliated with Spotify AB._
