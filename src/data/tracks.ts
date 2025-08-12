import { Track } from '../types/music';

export const lofiTracks = [
  {
    id: 'lofi-girl-1',
    title: 'lofi hip hop radio 📚 - beats to relax/study to',
    channel: 'Lofi Girl',
    youtubeId: 'jfKfPfyJRdk'
  },
  {
    id: 'lofi-girl-sleep',
    title: 'lofi hip hop radio 😴 - beats to sleep/chill to',
    channel: 'Lofi Girl',
    youtubeId: 'rUxyKA_-grg'
  },
  {
    id: 'chillhop-raccoon',
    title: 'jazzy hip hop 🎷 - smooth beats to relax/study to',
    channel: 'Chillhop Music',
    youtubeId: '5yx6BWlEVcY'
  },
  {
    id: 'college-music',
    title: 'chill lofi hip hop radio 📻 24/7',
    channel: 'College Music',
    youtubeId: 'f02mOEt11OQ'
  },
  {
    id: 'chilled-cow-backup',
    title: 'peaceful piano 🎹 - calming music',
    channel: 'Lofi Girl',
    youtubeId: 'DWcJFNfaw9c'
  },
  {
    id: 'simple-lofi',
    title: 'lofi hip hop mix 🎧 - chill study beats',
    channel: 'Simple Lofi',
    youtubeId: '36YnV9STBqc'
  }
] as const satisfies readonly Track[];