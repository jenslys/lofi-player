import { memo } from 'react';

const PLAY_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
);

const PAUSE_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M6 19h4V5H6v14zM14 5v14h4V5h-4z" fill="currentColor" />
  </svg>
);

const PREVIOUS_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor" />
  </svg>
);

const NEXT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor" />
  </svg>
);

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PlayerControls = memo(function PlayerControls({ isPlaying, isLoading, onPlayPause, onNext, onPrevious }: PlayerControlsProps) {
  return (
    <div className="player-controls">
      <button
        className="control-button previous-button"
        onClick={onPrevious}
        disabled={isLoading}
        tabIndex={-1}
      >
        {PREVIOUS_ICON}
      </button>
      
      <button
        className={`control-button play-pause-button ${isPlaying ? 'playing' : 'paused'}`}
        onClick={onPlayPause}
        disabled={isLoading}
        tabIndex={0}
      >
        {isLoading ? (
          <div className="loading-spinner small"></div>
        ) : isPlaying ? (
          PAUSE_ICON
        ) : (
          PLAY_ICON
        )}
      </button>
      
      <button
        className="control-button next-button"
        onClick={onNext}
        disabled={isLoading}
        tabIndex={-1}
      >
        {NEXT_ICON}
      </button>
    </div>
  );
});

