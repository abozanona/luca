import SocketEngine from '../socket-engine';
import VideoControllerEngine from '../video-controller-engine';

export class GeneralVideoController extends VideoControllerEngine {
    selectedVideo: HTMLVideoElement = null;

    constructor(socketEngine: SocketEngine) {
        Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
            get: function () {
                return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
            },
        });
        super(socketEngine);
    }

    setVideo(video: HTMLVideoElement) {
        this.selectedVideo = video;
    }

    public playVideo(): void {
        this.selectedVideo.play();
    }

    public isVideoPlaying(): boolean {
        return (<any>this.selectedVideo).playing;
    }

    public isVideoPaused(): boolean {
        return this.selectedVideo.paused;
    }

    public pauseVideo(): void {
        this.selectedVideo.pause();
    }

    public seekVideo(time: number): void {
        this.selectedVideo.currentTime = time;
    }

    public getCurrentVideoTime(): number {
        return this.selectedVideo.currentTime;
    }

    private playEventListner: (event: Event) => void;

    private pauseEventListner: (event: Event) => void;

    private seekedEventListner: (event: Event) => void;

    public initVideoListners(): void {
        this.playEventListner = (event: Event) => {
            this.onVideoPlay();
        }

        this.pauseEventListner = (event: Event) => {
            this.onVideoPause();
        }

        this.seekedEventListner = (event: Event) => {
            this.onVideoSeek();
        }
        this.selectedVideo.addEventListener('play', this.playEventListner);
        this.selectedVideo.addEventListener('pause', this.pauseEventListner);
        this.selectedVideo.addEventListener('seeked', this.seekedEventListner);
    }

    public destroyVideoListners(): void {
        this.selectedVideo.removeEventListener('play', this.playEventListner);
        this.selectedVideo.removeEventListener('pause', this.pauseEventListner);
        this.selectedVideo.removeEventListener('seeked', this.seekedEventListner);
    }
}

export default GeneralVideoController;
