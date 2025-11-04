<p align="center">
  <img src="src-tauri/icons/icon.png" alt="Lofi Player icon" width="128" height="128">
</p>

# Lofi Player

Lofi Player is a minimalist desktop music player built with **Tauri** and **React**. It streams curated lofi hip hop playlists from YouTube in a lightweight desktop shell.

https://github.com/user-attachments/assets/4bb330f1-6af5-4411-afb5-4263697efb1f

## Features

- Continuous streaming from curated YouTube playlists
- Remembers volume and resumes the most recent track
- Minimal, distraction-free interface
- Menu bar controls through the system tray

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/)
- [Rust](https://rustup.rs/) (for Tauri)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/jenslys/lofi-player.git
cd lofi-player

# Install dependencies
bun install

# Start development server
bun run dev
```

### Building for Production

```bash
# Build the desktop app
bun run tauri build
```

## License

MIT
