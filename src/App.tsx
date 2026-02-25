import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpotlightLayout from "./components/SpotlightLayout";
import ScenePage from "./pages/ScenePage";
import GraffitiWall from "./pages/GraffitiWall";
import Directives from "./pages/Directives";

export function App() {
  return (
    <BrowserRouter>
      <SpotlightLayout>
        <Routes>
          <Route path="/" element={<ScenePage />} />
          <Route path="/yard" element={<GraffitiWall />} />
          <Route path="/directives" element={<Directives />} />
        </Routes>
      </SpotlightLayout>
    </BrowserRouter>
  );
}

export default App;
