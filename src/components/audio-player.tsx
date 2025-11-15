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
    <section className="audio-player" aria-label="Flow player">
      <div id="youtube-player" style={{ display: 'none' }} aria-hidden="true"></div>

      <div className="player-inline">
        <PlayerControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          onPlayPause={togglePlayPause}
          onNext={nextTrack}
          onPrevious={previousTrack}
        />

        <div className="player-bottom">
          <VolumeControl
            volume={volume}
            onVolumeChange={setVolume}
          />
        </div>

        <span className="player-status" role="status" aria-live="polite">
          {error ? 'switching stream' : ''}
        </span>
      </div>
    </section>
  );
}
