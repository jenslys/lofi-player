import { useEffect } from 'react';
import { useAudioPlayer } from '../hooks/use-audio-player';
import { PlayerControls } from './player-controls';
import { TrackDisplay } from './track-display';
import { VolumeControl } from './volume-control';
import { youtubePlayerService } from '../services/youtube-player';

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    error,
    volume,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
  } = useAudioPlayer();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      youtubePlayerService.cleanup();
    };
  }, []);

  return (
    <div className="audio-player">
      {/* Hidden YouTube iframe container */}
      <div id="youtube-player" style={{ display: 'none' }}></div>
      
      <div className="player-content">
        <TrackDisplay 
          track={currentTrack}
          isPlaying={isPlaying}
          isLoading={isLoading}
        />
        
        <PlayerControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          onPlayPause={togglePlayPause}
          onNext={nextTrack}
          onPrevious={previousTrack}
        />
        
        <VolumeControl
          volume={volume}
          onVolumeChange={setVolume}
        />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}