import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

function Home() {
  return (
    <section className="flex flex-col items-center bg-radial from-green-900 to-gray-950 to-95% h-screen max-h-[calc(100vh-40px)] p-2">
      <div className="py-6 align-self-center mx-auto">
        <h1 className="text-gray-200 text-2xl font-bold text-center">
          Welcome to Spotify Artist Finder
        </h1>
      </div>
      <img src="/find_artist.png" alt="Find Artist" width={300} height={300} />
      <div className="text-center text-gray-200">
        <Link to="/search" className="[&.active]:font-bold ">
          <Button className="my-auto text-lg font-bold text-white" size={"lg"}>
            Searching for artists!
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default Home;
