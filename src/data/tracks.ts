import { Track } from '../types/music';

export const lofiTracks = [
  {
    id: 'lofi-hip-hop-radio',
    title: 'lofi hip hop radio 📚 beats to relax/study to',
    channel: 'Lofi Girl',
    youtubeId: 'jfKfPfyJRdk'
  },
  {
    id: 'lofi-sleep-radio',
    title: 'lofi hip hop radio 💤 beats to sleep/chill to',
    channel: 'Lofi Girl',
    youtubeId: '28KRPhVzCus'
  },
  {
    id: 'jazz-lofi-radio',
    title: 'jazz lofi radio 🎷 beats to chill/study to',
    channel: 'Lofi Girl',
    youtubeId: 'HuFYqnbVbzY'
  },
  {
    id: 'synthwave-radio',
    title: 'synthwave radio 🌌 beats to chill/game to',
    channel: 'Lofi Girl',
    youtubeId: '4xDzrJKXOOY'
  },
  {
    id: 'rainy-day-lofi',
    title: 'sad lofi radio ☔ beats for rainy days',
    channel: 'Lofi Girl',
    youtubeId: 'P6Segk8cr-c'
  },
  {
    id: 'pomodoro-study',
    title: 'Study With Me 📚 Pomodoro',
    channel: 'Lofi Girl',
    youtubeId: '1oDrJba2PSs'
  }
] as const satisfies readonly Track[];
