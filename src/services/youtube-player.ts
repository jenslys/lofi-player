declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (elementId: string, options: YouTubePlayerOptions) => YouTubePlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}

interface YouTubePlayerOptions {
  height: number;
  width: number;
  videoId: string;
  playerVars: {
    autoplay: number;
    controls: number;
    disablekb: number;
    modestbranding: number;
    rel: number;
    showinfo: number;
  };
  events: {
    onReady: (event: { target: YouTubePlayer }) => void;
    onStateChange: (event: { data: number; target: YouTubePlayer }) => void;
    onError: (event: { data: number; target: YouTubePlayer }) => void;
  };
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  loadVideoById: (videoId: string) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getPlayerState: () => number;
}

type PlayerEventType = 'ready' | 'playing' | 'paused' | 'ended' | 'error';

type PlayerEventData = {
  ready: undefined;
  playing: undefined;
  paused: undefined;
  ended: undefined;
  error: string;
};

type PlayerEventCallback = <T extends PlayerEventType>(
  event: T,
  data?: PlayerEventData[T]
) => void;

/**
 * Service for managing YouTube iframe player integration
 * Handles API loading, player initialization, and event management
 */
class YouTubePlayerService {
  private player: YouTubePlayer | null = null;
  private isAPIReady = false;
  private callbacks: PlayerEventCallback[] = [];

  constructor() {
    this.loadYouTubeAPI();
  }

  private loadYouTubeAPI(): void {
    if (window.YT?.Player) {
      this.isAPIReady = true;
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag?.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      this.isAPIReady = true;
      this.initializePlayer();
    };
  }

  private initializePlayer(): void {
    if (!this.isAPIReady) return;

    this.player = new window.YT.Player('youtube-player', {
      height: 1,
      width: 1,
      videoId: '',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: () => {
          this.notifyCallbacks('ready');
        },
        onStateChange: (event) => {
          const state = event.data;
          if (state === window.YT.PlayerState.PLAYING) {
            this.notifyCallbacks('playing');
          } else if (state === window.YT.PlayerState.PAUSED) {
            this.notifyCallbacks('paused');
          } else if (state === window.YT.PlayerState.ENDED) {
            this.notifyCallbacks('ended');
          }
        },
        onError: (event) => {
          const errorMessages: Record<number, string> = {
            2: 'Invalid video ID or video unavailable',
            5: 'Video cannot be played in HTML5 player',
            100: 'Video not found or private',
            101: 'Video owner does not allow embedding',
            150: 'Video owner does not allow embedding'
          };
          const errorCode = event.data;
          const errorMsg = errorMessages[errorCode] ?? `Unknown error: ${errorCode}`;
          console.error('YouTube Player Error:', errorMsg);
          this.notifyCallbacks('error', errorMsg);
        },
      },
    });
  }

  /**
   * Registers an event callback and returns cleanup function
   * @param callback Function to handle player events
   * @returns Cleanup function to remove the callback
   */
  onPlayerEvent(callback: PlayerEventCallback): () => void {
    this.callbacks.push(callback);
    
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  private notifyCallbacks<T extends PlayerEventType>(event: T, data?: PlayerEventData[T]): void {
    this.callbacks.forEach(callback => callback(event, data));
  }

  /**
   * Loads a YouTube video by ID, waiting for player readiness
   * @param videoId YouTube video identifier
   */
  async loadVideo(videoId: string): Promise<void> {
    if (!this.player || !this.isAPIReady) {
      await new Promise<void>((resolve) => {
        const checkReady = () => {
          if (this.player && this.isAPIReady) {
            resolve();
          } else {
            setTimeout(checkReady, 50);
          }
        };
        checkReady();
      });
    }

    this.player!.loadVideoById(videoId);
  }

  play(): void {
    if (this.player) {
      this.player.playVideo();
    }
  }

  pause(): void {
    if (this.player) {
      this.player.pauseVideo();
    }
  }

  setVolume(volume: number): void {
    if (this.player && typeof volume === 'number' && !isNaN(volume)) {
      this.player.setVolume(Math.max(0, Math.min(100, volume)));
    }
  }

  getVolume(): number {
    return this.player ? this.player.getVolume() : 50;
  }

  isReady(): boolean {
    return this.isAPIReady && this.player !== null;
  }

  cleanup(): void {
    if (this.player) {
      this.player.stopVideo();
      this.player = null;
    }
    this.callbacks = [];
  }
}

export const youtubePlayerService = new YouTubePlayerService();