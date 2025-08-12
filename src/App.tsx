import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AudioPlayer } from "./components/audio-player";

import "./App.css";
import "./components/audio-player.css";

function App() {
  useEffect(() => {
    invoke("init");
  }, []);

  return (
    <div className="container">
      <AudioPlayer />
    </div>
  );
}

export default App;
