const STORAGE_KEYS = {
  VOLUME: 'lofi-player-volume',
  CURRENT_INDEX: 'lofi-player-current-index',
} as const;

export function saveVolume(volume: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
  } catch (error) {
    console.warn('Failed to save volume to localStorage:', error);
  }
}

export function loadVolume(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VOLUME);
    if (stored !== null) {
      const volume = parseInt(stored, 10);
      if (volume >= 0 && volume <= 100) {
        return volume;
      }
    }
  } catch (error) {
    console.warn('Failed to load volume from localStorage:', error);
  }
  return 50; // Default volume
}

export function saveCurrentIndex(index: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, index.toString());
  } catch (error) {
    console.warn('Failed to save current index to localStorage:', error);
  }
}

export function loadCurrentIndex(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
    if (stored !== null) {
      const index = parseInt(stored, 10);
      if (index >= 0) {
        return index;
      }
    }
  } catch (error) {
    console.warn('Failed to load current index from localStorage:', error);
  }
  return 0; // Default to first track
}