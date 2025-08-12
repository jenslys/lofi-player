import { useEffect } from 'preact/hooks';
import { useAudioPlayer } from '../hooks/use-audio-player';
import { PlayerControls } from './player-controls';
import { VolumeControl } from './volume-control';
import { youtubePlayerService } from '../services/youtube-player';

/**
 * Main audio player component that orchestrates playback controls and display
 * @returns The complete audio player interface
 */
export function AudioPlayer() {
  const {
    isPlaying,
    isLoading,
    error,
    volume,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
  } = useAudioPlayer();

  useEffect(() => {
    return () => {
      youtubePlayerService.cleanup();
    };
  }, []);

  return (
    <div className="audio-player">
      <div id="youtube-player" style={{ display: 'none' }}></div>
      
      <div className="player-content">
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