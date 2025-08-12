export interface Track {
  readonly id: string;
  readonly title: string;
  readonly channel: string;
  readonly youtubeId: string;
}

export interface PlayerState {
  readonly currentTrack: Track | null;
  readonly isPlaying: boolean;
  readonly isLoading: boolean;
  readonly volume: number;
  readonly queue: readonly Track[];
  readonly currentIndex: number;
  readonly error: string | null;
}

export type PlayerAction =
  | { readonly type: 'SET_TRACKS'; readonly payload: readonly Track[] }
  | { readonly type: 'PLAY' }
  | { readonly type: 'PAUSE' }
  | { readonly type: 'NEXT_TRACK' }
  | { readonly type: 'PREVIOUS_TRACK' }
  | { readonly type: 'SET_LOADING'; readonly payload: boolean }
  | { readonly type: 'SET_VOLUME'; readonly payload: number }
  | { readonly type: 'SET_ERROR'; readonly payload: string | null }
  | { readonly type: 'SET_CURRENT_TRACK'; readonly payload: Track };