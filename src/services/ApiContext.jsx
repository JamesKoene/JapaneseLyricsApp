import { createContext, useContext, useEffect, useState } from "react";

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBase = import.meta.env.PROD
          ? "https://justj.app.n8n.cloud"
          : "/api";
        const res = await fetch(
          `${apiBase}/webhook/2e6d7e72-84b4-494b-991e-b9fd58d40ad2`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const songs = await res.json();

        const rankedSongs = songs.map((song, index) => ({
          ...song,
          name: `${index + 1}. ${song.name}`, // prepend rank
        }));
        setData(rankedSongs);
      } catch (err) {
        console.error("API fetch error:", err);
        setError(err.message || "Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // New function to get a single row by id
  const getSongByVideoId = (videoId) => {
    if (!data || !Array.isArray(data)) return null;
    return data.find((song) => song.videoId === videoId);
  };
  return (
    <ApiContext.Provider value={{ data, loading, error, getSongByVideoId }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
