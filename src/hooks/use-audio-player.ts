import { useReducer, useEffect, useCallback, useState } from 'preact/hooks';
import { invoke } from '@tauri-apps/api/core';
import { PlayerState, PlayerAction } from '../types/music';
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

/**
 * Manages audio player state transitions
 * @param state Current player state
 * @param action State change action
 * @returns Updated player state
 */
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
      if (state.queue.length === 0) {
        return state;
      }
      const nextIndex = (state.currentIndex + 1) % state.queue.length;
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.queue[nextIndex] || null,
        isLoading: true,
      };

    case 'PREVIOUS_TRACK':
      if (state.queue.length === 0) {
        return state;
      }
      const prevIndex = state.currentIndex === 0 ? state.queue.length - 1 : state.currentIndex - 1;
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.queue[prevIndex] || null,
        isLoading: true,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
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

/**
 * Custom hook for managing audio player state and YouTube integration
 * @returns Player state and control functions
 */
export function useAudioPlayer() {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    dispatch({ type: 'SET_TRACKS', payload: lofiTracks });
  }, []);

  useEffect(() => {
    const unsubscribe = youtubePlayerService.onPlayerEvent((event, data) => {
      switch (event) {
        case 'ready':
          setPlayerReady(true);
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
          dispatch({
            type: 'SET_ERROR',
            payload: data ?? 'We could not reach that stream just now.',
          });
          if (state.queue.length > 0) {
            dispatch({ type: 'NEXT_TRACK' });
          }
          break;
      }
    });

    return unsubscribe;
  }, [state.volume, state.queue.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveCurrentIndex(state.currentIndex);
      saveVolume(state.volume);
    }, 100);

    return () => clearTimeout(timer);
  }, [state.currentIndex, state.volume]);

  useEffect(() => {
    if (playerReady && state.currentTrack) {
      dispatch({ type: 'SET_LOADING', payload: true });
      youtubePlayerService.loadVideo(state.currentTrack.youtubeId);
    }
  }, [playerReady, state.currentTrack]);

  useEffect(() => {
    invoke('update_tray_icon', { isPlaying: state.isPlaying }).catch(console.error);
  }, [state.isPlaying]);

  const play = useCallback(() => {
    if (state.currentTrack) {
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_LOADING', payload: true });
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
