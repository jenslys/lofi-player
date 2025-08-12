export interface Track {
  id: string;
  title: string;
  channel: string;
  youtubeId: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  queue: Track[];
  currentIndex: number;
  error: string | null;
}

export type PlayerAction =
  | { type: 'SET_TRACKS'; payload: Track[] }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_TRACK'; payload: Track };