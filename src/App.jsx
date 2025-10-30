import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Grid } from "./components/Grid";
import { About } from "./components/About";
import { Nav } from "./components/Nav";
import { LyricPage } from "./components/LyricPage";
import { Search } from "./components/Search";
function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Grid />} />
        <Route path="/lyric/:id" element={<LyricPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
