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

    playVideo(): void {
        this.selectedVideo.play();
    }

    isVideoPlaying(): boolean {
        return (<any>this.selectedVideo).playing;
    }

    isVideoPaused(): boolean {
        return this.selectedVideo.paused;
    }

    pauseVideo(): void {
        this.selectedVideo.pause();
    }

    seekVideo(time: number): void {
        this.selectedVideo.currentTime = time;
    }

    getCurrentVideoTime(): number {
        return this.selectedVideo.currentTime;
    }

    initVideoListners(): void {
        this.selectedVideo.addEventListener('play', (event) => {
            this.onVideoPlay();
        });
        this.selectedVideo.addEventListener('pause', (event) => {
            this.onVideoPause();
        });
        this.selectedVideo.addEventListener('seeked', (event) => {
            this.onVideoSeek();
        });
    }
}

export default GeneralVideoController;
