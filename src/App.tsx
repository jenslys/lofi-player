import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AudioPlayer } from "./components/audio-player";

import "./App.css";
import "./components/audio-player.css";

/**
 * Main application component for the Lofi Player
 */
function App() {
  useEffect(() => {
    invoke("init");
    
    setTimeout(() => {
      if (document.activeElement && document.activeElement !== document.body) {
        if ('blur' in document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      }
    }, 100);
  }, []);

  return (
    <div className="container">
      <AudioPlayer />
    </div>
  );
}

export default App;
