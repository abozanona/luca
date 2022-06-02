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

    playVideo(): void {
        document.body.dispatchEvent(new CustomEvent('playVideo', {}));
    }

    isVideoPlaying(): boolean {
        return this.currentPlayerStatus.isPlayed;
    }

    isVideoPaused(): boolean {
        return this.currentPlayerStatus.isPaused;
    }

    pauseVideo(): void {
        document.body.dispatchEvent(new CustomEvent('pauseVideo', {}));
    }

    seekVideo(time: number): void {
        document.body.dispatchEvent(new CustomEvent('seekVideo', { detail: { time: time } }));
    }

    getCurrentVideoTime(): number {
        return this.currentPlayerStatus.currentTime;
    }

    initVideoListners(): void {
        let _this = this;
        document.body.addEventListener(
            'videoplay',
            function (e) {
                _this.currentPlayerStatus = (<any>e).detail;
                _this.onVideoPlay();
            },
            false
        );
        document.body.addEventListener(
            'videopause',
            function (e) {
                _this.currentPlayerStatus = (<any>e).detail;
                _this.onVideoPause();
            },
            false
        );
        document.body.addEventListener(
            'videotimechange',
            function (e) {
                _this.currentPlayerStatus = (<any>e).detail;
                _this.onVideoSeek();
            },
            false
        );
    }
}

export default NetflixVideoController;
