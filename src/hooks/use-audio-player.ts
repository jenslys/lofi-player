import { useReducer, useEffect, useCallback } from 'react';
import { PlayerState, PlayerAction, Track } from '../types/music';
import { lofiTracks } from '../data/tracks';
import { fisherYatesShuffle } from '../utils/shuffle';
import { youtubePlayerService } from '../services/youtube-player';
import { loadVolume, saveVolume, loadCurrentIndex, saveCurrentIndex } from '../utils/storage';

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  volume: loadVolume(),
  queue: [],
  currentIndex: loadCurrentIndex(),
  error: null,
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_TRACKS':
      const shuffledTracks = fisherYatesShuffle(action.payload);
      const savedIndex = loadCurrentIndex();
      const validIndex = savedIndex < shuffledTracks.length ? savedIndex : 0;
      return {
        ...state,
        queue: shuffledTracks,
        currentTrack: shuffledTracks[validIndex] || null,
        currentIndex: validIndex,
      };

    case 'PLAY':
      return {
        ...state,
        isPlaying: true,
        error: null,
      };

    case 'PAUSE':
      return {
        ...state,
        isPlaying: false,
      };

    case 'NEXT_TRACK':
      const nextIndex = (state.currentIndex + 1) % state.queue.length;
      saveCurrentIndex(nextIndex);
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.queue[nextIndex] || null,
        isLoading: true,
        error: null,
      };

    case 'PREVIOUS_TRACK':
      const prevIndex = state.currentIndex === 0 ? state.queue.length - 1 : state.currentIndex - 1;
      saveCurrentIndex(prevIndex);
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.queue[prevIndex] || null,
        isLoading: true,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_VOLUME':
      saveVolume(action.payload);
      return {
        ...state,
        volume: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isPlaying: false,
      };

    case 'SET_CURRENT_TRACK':
      return {
        ...state,
        currentTrack: action.payload,
      };

    default:
      return state;
  }
}

export function useAudioPlayer() {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  // Initialize tracks on mount
  useEffect(() => {
    dispatch({ type: 'SET_TRACKS', payload: lofiTracks });
  }, []);

  // Setup YouTube player event handlers
  useEffect(() => {
    youtubePlayerService.onPlayerEvent((event, data) => {
      switch (event) {
        case 'ready':
          // Set the saved volume when player is ready
          youtubePlayerService.setVolume(state.volume);
          dispatch({ type: 'SET_LOADING', payload: false });
          break;
        case 'playing':
          dispatch({ type: 'PLAY' });
          dispatch({ type: 'SET_LOADING', payload: false });
          break;
        case 'paused':
          dispatch({ type: 'PAUSE' });
          break;
        case 'ended':
          dispatch({ type: 'NEXT_TRACK' });
          break;
        case 'error':
          console.error(`YouTube player error: ${data}`);
          // Automatically skip to next track on error
          setTimeout(() => {
            dispatch({ type: 'NEXT_TRACK' });
          }, 1000);
          break;
      }
    });
  }, []);

  // Load new track when currentTrack changes
  useEffect(() => {
    if (state.currentTrack && youtubePlayerService.isReady()) {
      dispatch({ type: 'SET_LOADING', payload: true });
      youtubePlayerService.loadVideo(state.currentTrack.youtubeId);
    }
  }, [state.currentTrack]);

  const play = useCallback(() => {
    if (state.currentTrack) {
      youtubePlayerService.play();
    }
  }, [state.currentTrack]);

  const pause = useCallback(() => {
    youtubePlayerService.pause();
  }, []);

  const nextTrack = useCallback(() => {
    dispatch({ type: 'NEXT_TRACK' });
  }, []);

  const previousTrack = useCallback(() => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  }, []);

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
    youtubePlayerService.setVolume(volume);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  return {
    ...state,
    play,
    pause,
    nextTrack,
    previousTrack,
    setVolume,
    togglePlayPause,
  };
}