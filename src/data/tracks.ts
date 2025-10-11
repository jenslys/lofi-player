import { Track } from '../types/music';

export const lofiTracks = [
  {
    id: 'lofi-hip-hop-radio',
    title: 'lofi hip hop radio - beats to relax/study to',
    channel: 'Lofi Girl',
    youtubeId: '5qap5aO4i9A'
  },
  {
    id: 'synthwave-radio',
    title: 'synthwave radio 🌌 beats to chill/game to',
    channel: 'Lofi Girl',
    youtubeId: '4xDzrJKXOOY'
  },
  {
    id: 'chillhop-radio',
    title: 'Chillhop Radio - jazzy & lofi hip hop beats 🐾',
    channel: 'Chillhop Music',
    youtubeId: '5yx6BWlEVcY'
  },
  {
    id: 'lofi-gaming',
    title: 'lofi beats to game/chill to 🎮',
    channel: 'Lofi Girl',
    youtubeId: 'lTRiuFIWV54'
  },
  {
    id: 'peaceful-piano',
    title: 'Peaceful Piano - Relaxing Piano Music for Studying',
    channel: 'Spotify',
    youtubeId: '5HVDGQy_tZs'
  },
  {
    id: 'jazz-hop',
    title: 'Jazz Hop - Relaxing Jazz & Hip Hop',
    channel: 'Jazz Hop Cafe',
    youtubeId: 'Dx5qFachd3A'
  }
] as const satisfies readonly Track[];