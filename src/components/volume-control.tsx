import { memo, useCallback } from 'react';

interface VolumeControlProps {
  readonly volume: number;
  readonly onVolumeChange: (volume: number) => void;
}

export const VolumeControl = memo(function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value, 10);
    if (!isNaN(newVolume) && newVolume >= 0 && newVolume <= 100) {
      onVolumeChange(newVolume);
    }
  }, [onVolumeChange]);

  return (
    <div className="volume-control">
      <div className="volume-slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          tabIndex={-1}
        />
        <div className="volume-value">{volume}</div>
      </div>
    </div>
  );
});

