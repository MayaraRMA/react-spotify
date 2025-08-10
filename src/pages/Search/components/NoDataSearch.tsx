function NoDataSearch() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-3">
      <h2 className="text-5xl font-bold text-gray-200 mb-4">
        Find your favorite artists!
      </h2>
      <img src="/find_artist.png" alt="Find Artist" width={270} height={270} />
      <p className="text-gray-400 p-4">
        Use the search bar above to look for artists and explore their music.
      </p>
    </div>
  );
}

export default NoDataSearch;
