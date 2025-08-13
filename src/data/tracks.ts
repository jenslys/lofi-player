import { Track } from '../types/music';

export const lofiTracks = [
  {
    id: 'lofi-girl-1',
    title: 'lofi hip hop radio 📚 - beats to relax/study to',
    channel: 'Lofi Girl',
    youtubeId: 'jfKfPfyJRdk'
  },
  {
    id: 'steezyasfuck',
    title: 'Steezyasfuck',
    channel: 'Steezyasfuck',
    youtubeId: 'UI5NKkW8acM'
  },
  {
    id: 'healing-me-1',
    title: 'Healing me',
    channel: 'Healing me',
    youtubeId: 'Rs0EOzsJPU0'
  },
  {
    id: 'healing-me-2',
    title: 'Healing me',
    channel: 'Healing me',
    youtubeId: 'bRnTGwCbr3E'
  },
  {
    id: 'relaxation-ambient',
    title: 'Relaxation ambient music',
    channel: 'Relaxation ambient music',
    youtubeId: 'tNkZsRW7h2c'
  },
  {
    id: 'retro-rhythm',
    title: 'Retro rhythm',
    channel: 'Retro rhythm',
    youtubeId: 'TfWotiyXGfI'
  }
] as const satisfies readonly Track[];