import { useParams } from "react-router-dom";
import { useApi } from "../services/ApiContext";
import { useState } from "react";

export function LyricPage() {
  const { getSongByVideoId } = useApi();
  const { id } = useParams();
  const song = getSongByVideoId(id); // fetch full song data from context
  console.log(song);
  if (!song) return <div>Song not found</div>;
  return (
    <>
      <Hero
        artist={song.artist.name}
        song={song.name}
        heroimage={song.thumbnails[0].url}
      />
      <main className="container mx-auto p-5">
        <div className="flex flex-col lg:flex-row gap-8">
          <Aside
            albumimage={song.hits[0].result.header_image_thumbnail_url}
            artist={song.artist.name}
            fulltitle={song.hits[0].result.full_title}
            videourl={"https://www.youtube.com/embed/" + id}
            releasedate={song.hits[0].result.release_date_for_display}
          />
          <RightContent
            title={song.name}
            japanese={song.content_2}
            english={song.content_1}
          />
        </div>
      </main>
    </>
  );
}

function Hero({ artist, song, heroimage }) {
  const decodedArtist = decodeURIComponent(artist || "Unknown Artist");
  const decodedSong = decodeURIComponent(song || "Unknown Song");

  return (
    <div className="w-full ">
      <div
        className="relative h-[40vh] bg-contain bg-center bg-repeat"
        style={{ backgroundImage: `url(${heroimage})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50"></div>
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              {decodedSong}
            </h1>
            <p className="text-lg md:text-xl mb-2 drop-shadow-md">
              By {decodedArtist}
            </p>
            <p className="text-base md:text-lg text-gray-200 drop-shadow-md">
              Japanese / English Lyrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Aside({ albumimage, artist, fulltitle, videourl, releasedate }) {
  return (
    <aside className="w-full lg:w-1/4">
      <div className="sticky top-8">
        {/* Song Details */}
        <section className="mb-4">
          <h3 className="text-lg font-semibold mb-3 mt-1">Song Details</h3>
          <div id="collapse-song-details">
            <div className="flex flex-col items-center">
              <img
                className="w-full h-auto rounded"
                src={albumimage}
                alt="Album"
              />
              <p className="mt-3 mb-1 font-bold text-center">{artist}</p>
              <p className="mb-1 text-center">{fulltitle}</p>
              <p className="mb-1 text-center">{releasedate}</p>
            </div>
          </div>
        </section>

        {/* Music Video */}
        <section className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Music Video</h3>
          <div className="relative w-full pb-[56.25%]">
            <iframe
              src={videourl}
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded"
              title="Music Video"
            ></iframe>
          </div>
        </section>
      </div>
    </aside>
  );
}

function RightContent({ title, english, japanese }) {
  return (
    <div className="w-full lg:w-9/12">
      <section>
        <h2 className="mt-1 mb-4 text-2xl font-semibold">
          {title.split(".")[1].split("-")[0]}
        </h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias non
          veniam cumque nemo natus ipsa repudiandae asperiores harum sequi,
          quasi nostrum fugiat est nesciunt iusto neque rerum consequuntur.
          Quam, voluptatibus.
        </p>
        {/* Kanji Analysis Section */}
        <h2 className="my-6 text-xl font-semibold">Kanji Analysis</h2>
        <KanjiTable japaneseLyrics={japanese} />
        <h2 className="my-4 text-xl font-semibold">Lyrics Table</h2>
        {japanese && japanese[0]?.lang === "ja" ? (
          <LyricsTable title={title} english={english} japanese={japanese} />
        ) : (
          <div className="w-full p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">Lyrics not available</p>
          </div>
        )}
      </section>
    </div>
  );
}

function LyricsTable({ english, japanese }) {
  // Merge English + Japanese arrays by index
  const mergedLyrics = english.map((line, i) => ({
    english: line.text,
    japanese: japanese[i]?.text || "",
  }));

  return (
    <div className="w-full">
      {/* Lyrics Table */}
      <div className="w-full overflow-x-auto lg:overflow-hidden rounded-xl border border-gray-200">
        <table className="table-auto w-full lg:w-full min-w-[600px] text-left">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider rounded-tl-lg">
                {japanese[0]?.lang || "Japanese"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider rounded-tr-lg">
                {english[0]?.lang || "English"}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mergedLyrics.map((line, i) => (
              <tr
                key={i}
                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-xl font-medium whitespace-nowrap text-gray-900 border-r border-gray-200">
                  {line.japanese}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {line.english}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KanjiTable({ japaneseLyrics }) {
  const [selectedKanjiData, setSelectedKanjiData] = useState(null);
  const handleKanjiClick = async (kanji) => {
    try {
      const response = await fetch(
        `https://kanjialive-api.p.rapidapi.com/api/public/kanji/${kanji}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "af6e64ddddmshf2c2bb0677b1e9ap1f1892jsn9b6f20592997",
            "x-rapidapi-host": "kanjialive-api.p.rapidapi.com",
          },
        }
      );
      const data = await response.json();
      setSelectedKanjiData(data);
    } catch (error) {
      console.error("Error fetching kanji info:", error);
    }
  };

  const kanjiCount = extractUniqueKanji(japaneseLyrics);
  const kanjiEntries = Object.entries(kanjiCount);

  if (kanjiEntries.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">No Kanji found</p>
      </div>
    );
  }

  // Sort kanji by frequency (most common first)
  const sortedKanji = kanjiEntries.sort((a, b) => b[1] - a[1]);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200">
      <div className="bg-gray-400 text-white px-6 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Kanji Analysis ({sortedKanji.length} unique characters)
        </h3>
      </div>
      <div className="bg-white p-6">
        <div className="h-64 overflow-y-auto">
          <div className="p-2 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {sortedKanji.map(([kanji, count]) => (
              <button
                key={kanji}
                onClick={() => handleKanjiClick(kanji)}
                className="text-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`View details for ${kanji}`}
              >
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {kanji}
                </div>
                <div className="text-xs text-gray-500">{count}x</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanji Details Section */}
      {selectedKanjiData && (
        <div className="mt-6  rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-400 text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-white bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">
                  {selectedKanjiData.kanji?.character || "?"}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Kanji Details
                  </h3>
                  <p className="text-blue-100">
                    {selectedKanjiData.kanji?.meaning?.english ||
                      "Unknown meaning"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedKanjiData(null)}
                className="text-white hover:text-red-200 text-3xl bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                aria-label="Close kanji details"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-lg">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
                    📚 Basic Information
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                      <h5 className="font-semibold text-blue-800 text-sm uppercase tracking-wide">
                        Meaning
                      </h5>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedKanjiData.kanji?.meaning?.english || "—"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg">
                      <h5 className="font-semibold text-green-800 text-sm uppercase tracking-wide">
                        Onyomi (音読み)
                      </h5>
                      <p className="text-gray-900 font-mono text-lg">
                        {selectedKanjiData.kanji?.onyomi?.romaji || "—"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg">
                      <h5 className="font-semibold text-purple-800 text-sm uppercase tracking-wide">
                        Kunyomi (訓読み)
                      </h5>
                      <p className="text-gray-900 font-mono text-lg">
                        {selectedKanjiData.kanji?.kunyomi?.romaji || "—"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg">
                        <h5 className="font-semibold text-orange-800 text-xs uppercase tracking-wide">
                          Strokes
                        </h5>
                        <p className="text-gray-900 font-bold text-xl">
                          {selectedKanjiData.kanji?.strokes?.count || "—"}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-3 rounded-lg">
                        <h5 className="font-semibold text-pink-800 text-xs uppercase tracking-wide">
                          Grade
                        </h5>
                        <p className="text-gray-900 font-bold text-xl">
                          {selectedKanjiData.references?.grade || "—"}
                        </p>
                      </div>
                    </div>

                    {selectedKanjiData.mn_hint && (
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-lg">
                        <h5 className="font-semibold text-yellow-800 text-sm uppercase tracking-wide">
                          💡 Memory Hint
                        </h5>
                        <p className="text-gray-900 text-sm leading-relaxed">
                          {selectedKanjiData.mn_hint}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Column - Visual Elements */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-lg">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
                    🎥 Visual Learning
                  </h4>

                  {/* Video */}
                  {selectedKanjiData.kanji?.video?.mp4 && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                        Stroke Order Video
                      </h5>
                      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                        <video
                          key={selectedKanjiData.kanji?.character}
                          height="100%"
                          width="100%"
                          controls
                          playsInline
                          autoPlay
                          className="w-full"
                        >
                          <source
                            src={selectedKanjiData.kanji.video.mp4}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}

                  {/* Stroke Images */}
                  {selectedKanjiData.kanji?.strokes?.images && (
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                        Stroke Order Images
                      </h5>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.values(
                          selectedKanjiData.kanji.strokes.images
                        ).map((src, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={src}
                              alt={`Stroke ${index + 1}`}
                              className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-blue-400 transition-colors"
                            />
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Examples */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-lg">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
                    📝 Examples ({selectedKanjiData.examples?.length || 0})
                  </h4>

                  {selectedKanjiData.examples &&
                  selectedKanjiData.examples.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {selectedKanjiData.examples.map((example, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="text-xl font-medium text-gray-900 mb-2 leading-relaxed">
                            {example.japanese || "—"}
                          </div>
                          <div className="text-sm text-gray-600 mb-2 italic">
                            {example.meaning?.english || "—"}
                          </div>
                          {example.audio?.mp3 && (
                            <button
                              onClick={() =>
                                new Audio(example.audio.mp3).play()
                              }
                              className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full transition-colors"
                            >
                              🔊 Play Audio
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-2">📚</div>
                      <p>No examples available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function extractKanjiFromText(text) {
  if (!text) return [];

  // Regex to match Kanji characters (Unicode range: \u4e00-\u9faf)
  const kanjiRegex = /[\u4e00-\u9faf]/g;
  const matches = text.match(kanjiRegex);

  return matches || [];
}

function extractUniqueKanji(japaneseLyrics) {
  if (!japaneseLyrics || japaneseLyrics.length === 0) return {};

  const kanjiCount = {};

  // Extract all Japanese text
  const allJapaneseText = japaneseLyrics.map((lyric) => lyric.text).join("");

  // Find all kanji characters
  const allKanji = extractKanjiFromText(allJapaneseText);

  // Count frequency of each kanji
  allKanji.forEach((kanji) => {
    kanjiCount[kanji] = (kanjiCount[kanji] || 0) + 1;
  });

  return kanjiCount;
}
