import { memo, useCallback } from 'react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl = memo(function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value, 10);
    onVolumeChange(newVolume);
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

