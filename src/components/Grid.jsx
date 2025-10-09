import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/ApiContext";

export function Grid() {
  const navigate = useNavigate();
  const { data: songs, loading, error } = useApi();
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredSongs = songs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="mt-10 p-4 flex flex-col sm:flex-row justify-center gap-5">
        <h1 className="text-4xl font-bold text-center">
          Top 100 Japanese Songs
        </h1>
        <input
          type="text"
          placeholder="Search for a song"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-center bg-gray-700 text-white p-2 rounded-md"
        />
      </header>

      {searchTerm && (
        <div className="text-center mt-4 text-gray-600">
          Showing {filteredSongs.length} of {songs.length} songs for "
          {searchTerm}"
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-10 p-4">
        {filteredSongs.map((song) => (
          <figure key={song.videoId} className="flex flex-col items-center">
            <div
              className="w-full mb-3 overflow-hidden rounded-lg aspect-video shadow-2xl cursor-pointer"
              onClick={() => {
                navigate(`/lyric/${song.videoId}`);
              }}
            >
              <img
                src={song.thumbnails[0].url}
                alt={song.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <figcaption className="text-center text-xs text-black-300">
              <div className="font-semibold mb-1">
                {song.name} {song.artist.name}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
