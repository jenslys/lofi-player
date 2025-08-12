import { memo } from 'react';
import { Track } from '../types/music';

interface TrackDisplayProps {
  track: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
}

export const TrackDisplay = memo(function TrackDisplay({ isLoading }: TrackDisplayProps) {
  return (
    <div className="track-display">
      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
});