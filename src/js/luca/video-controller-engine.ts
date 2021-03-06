import VideoControllerInterface from '../luca/interfaces/video-controller-interface';
import SocketEngine from './socket-engine';

export abstract class VideoControllerEngine implements VideoControllerInterface {
    isVideoSelected: boolean;
    pageUrl: string = null;
    videoXPath: string = null;

    allowedActions: {
        pause: number;
        play: number;
        seek: number;
    } = {
        pause: 0,
        play: 0,
        seek: 0,
    };

    constructor(public socketEngine: SocketEngine) {
        this.pageUrl = window.location.href;
    }

    public abstract playVideo(): void;
    public abstract isVideoPlaying(): boolean;
    public abstract isVideoPaused(): boolean;
    public abstract pauseVideo(): void;
    public abstract seekVideo(time: number): void;
    public abstract getCurrentVideoTime(): number;
    public abstract initVideoListners(): void;
    public abstract destroyVideoListners(): void;

    public play() {
        if (this.isVideoPlaying()) {
            return;
        }
        this.allowedActions.play++;
        this.playVideo();
    }

    public pause() {
        if (this.isVideoPaused()) {
            return;
        }
        this.allowedActions.pause++;
        this.pauseVideo();
    }

    public seek(time: number) {
        if (this.getCurrentVideoTime() == time) {
            return;
        }
        this.allowedActions.seek++;
        this.seekVideo(time);
    }

    public onVideoPlay() {
        if (this.allowedActions.play < 0) {
            this.allowedActions.play = 0;
        }
        if (this.allowedActions.play == 0) {
            this.socketEngine.sendSocketOrder('play', {
                time: this.getCurrentVideoTime(),
            });
        }
        if (this.allowedActions.play > 0) {
            this.allowedActions.play--;
        }
    }

    public onVideoPause() {
        if (this.allowedActions.pause < 0) {
            this.allowedActions.pause = 0;
        }
        if (this.allowedActions.pause == 0) {
            this.socketEngine.sendSocketOrder('pause', {
                time: this.getCurrentVideoTime(),
            });
        }
        if (this.allowedActions.pause > 0) {
            this.allowedActions.pause--;
        }
    }

    public onVideoSeek() {
        if (this.allowedActions.seek < 0) {
            this.allowedActions.seek = 0;
        }
        if (this.allowedActions.seek == 0) {
            this.socketEngine.sendSocketOrder('seek', {
                time: this.getCurrentVideoTime(),
            });
        }
        if (this.allowedActions.seek > 0) {
            this.allowedActions.seek--;
        }
    }

    public startStreamingOnVideo() {
        this.isVideoSelected = true;
        document.querySelectorAll('.luca-video-highlight').forEach((el) => {
            el.remove();
        });
        this.initVideoListners();
    }
}

export default VideoControllerEngine;
