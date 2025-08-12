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

type PlayerEventCallback = (event: 'ready' | 'playing' | 'paused' | 'ended' | 'error', data?: any) => void;

class YouTubePlayerService {
  private player: YouTubePlayer | null = null;
  private isAPIReady = false;
  private callbacks: PlayerEventCallback[] = [];
  private currentVideoId = '';

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
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

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
          const errorMessages = {
            2: 'Invalid video ID or video unavailable',
            5: 'Video cannot be played in HTML5 player',
            100: 'Video not found or private',
            101: 'Video owner does not allow embedding',
            150: 'Video owner does not allow embedding'
          };
          const errorMsg = errorMessages[event.data as keyof typeof errorMessages] || `Unknown error: ${event.data}`;
          console.error('YouTube Player Error:', errorMsg);
          this.notifyCallbacks('error', errorMsg);
        },
      },
    });
  }

  onPlayerEvent(callback: PlayerEventCallback): void {
    this.callbacks.push(callback);
  }

  private notifyCallbacks(event: 'ready' | 'playing' | 'paused' | 'ended' | 'error', data?: any): void {
    this.callbacks.forEach(callback => callback(event, data));
  }

  async loadVideo(videoId: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.player || !this.isAPIReady) {
        setTimeout(() => this.loadVideo(videoId).then(resolve), 100);
        return;
      }

      this.currentVideoId = videoId;
      this.player.loadVideoById(videoId);
      resolve();
    });
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
    if (this.player) {
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