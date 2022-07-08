import SocketEngine from '../socket-engine';
import VideoControllerEngine from '../video-controller-engine';

export class NetflixVideoController extends VideoControllerEngine {
    lastCurrentTime: number = 0;

    currentPlayerStatus: {
        currentTime: number;
        isPaused: boolean;
        isPlayed: boolean;
    } = {
            currentTime: 0,
            isPaused: false,
            isPlayed: true,
        };

    constructor(socketEngine: SocketEngine) {
        super(socketEngine);
    }

    public playVideo(): void {
        document.body.dispatchEvent(new CustomEvent('playVideo', {}));
    }

    public isVideoPlaying(): boolean {
        return this.currentPlayerStatus.isPlayed;
    }

    public isVideoPaused(): boolean {
        return this.currentPlayerStatus.isPaused;
    }

    public pauseVideo(): void {
        document.body.dispatchEvent(new CustomEvent('pauseVideo', {}));
    }

    public seekVideo(time: number): void {
        document.body.dispatchEvent(new CustomEvent('seekVideo', { detail: { time: time } }));
    }

    public getCurrentVideoTime(): number {
        return this.currentPlayerStatus.currentTime;
    }

    private playEventListner: (event: Event) => void;

    private pauseEventListner: (event: Event) => void;

    private seekedEventListner: (event: Event) => void;

    public initVideoListners(): void {
        this.playEventListner = (event: Event) => {
            this.currentPlayerStatus = (<any>event).detail;
            this.onVideoPlay();
        }

        this.pauseEventListner = (event: Event) => {
            this.currentPlayerStatus = (<any>event).detail;
            this.onVideoPause();
        }

        this.seekedEventListner = (event: Event) => {
            this.currentPlayerStatus = (<any>event).detail;
            this.onVideoSeek();
        }

        let _this = this;
        document.body.addEventListener(
            'videoplay',
            _this.playEventListner,
            false
        );
        document.body.addEventListener(
            'videopause',
            _this.pauseEventListner,
            false
        );
        document.body.addEventListener(
            'videotimechange',
            _this.seekedEventListner,
            false
        );
    }

    public destroyVideoListners(): void {
        document.body.removeEventListener('videoplay', this.playEventListner, false);
        document.body.removeEventListener('videopause', this.pauseEventListner, false);
        document.body.removeEventListener('videotimechange', this.seekedEventListner, false);
    }

}

export default NetflixVideoController;
