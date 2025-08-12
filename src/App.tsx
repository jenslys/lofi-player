import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

import "./App.css";

function App() {
  useEffect(() => {
    invoke("init");
  }, []);

  return (
    <div className="container">
      <h1>Lofi Player</h1>
      <p>Ready to play some chill beats...</p>
    </div>
  );
}

export default App;
