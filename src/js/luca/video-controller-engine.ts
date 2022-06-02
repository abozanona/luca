import VideoControllerInterface from '../luca/interfaces/video-controller-interface';
import SocketEngine from './socket-engine';

export abstract class VideoControllerEngine implements VideoControllerInterface {
    isVideoSelected: boolean;
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

    constructor(public socketEngine: SocketEngine) {}

    abstract playVideo(): void;
    abstract isVideoPlaying(): boolean;
    abstract isVideoPaused(): boolean;
    abstract pauseVideo(): void;
    abstract seekVideo(time: number): void;
    abstract getCurrentVideoTime(): number;
    abstract initVideoListners(): void;

    play() {
        if (this.isVideoPlaying()) {
            return;
        }
        this.allowedActions.play++;
        this.playVideo();
    }

    pause() {
        if (this.isVideoPaused()) {
            return;
        }
        this.allowedActions.pause++;
        this.pauseVideo();
    }

    seek(time: number) {
        if (this.getCurrentVideoTime() == time) {
            return;
        }
        this.allowedActions.seek++;
        this.seekVideo(time);
    }

    onVideoPlay() {
        if (this.allowedActions.play < 0) {
            this.allowedActions.play = 0;
        }
        if (this.allowedActions.play == 0) {
            this.socketEngine.sendPlayerOrder('play', {
                time: this.getCurrentVideoTime(),
            });
        }
        if (this.allowedActions.play > 0) {
            this.allowedActions.play--;
        }
    }

    onVideoPause() {
        if (this.allowedActions.pause < 0) {
            this.allowedActions.pause = 0;
        }
        if (this.allowedActions.pause == 0) {
            this.socketEngine.sendPlayerOrder('pause', {
                time: this.getCurrentVideoTime(),
            });
        }
        if (this.allowedActions.pause > 0) {
            this.allowedActions.pause--;
        }
    }

    onVideoSeek() {
        if (this.allowedActions.seek < 0) {
            this.allowedActions.seek = 0;
        }
        if (this.allowedActions.seek == 0) {
            this.socketEngine.sendPlayerOrder('seek', {
                time: this.getCurrentVideoTime(),
            });
        }
        if (this.allowedActions.seek > 0) {
            this.allowedActions.seek--;
        }
    }

    startStreamingOnVideo() {
        if (this.isVideoSelected) {
            alert(
                'Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.'
            );
            return;
        }
        this.isVideoSelected = true;
        document.querySelectorAll('.luca-video-highlight').forEach((el) => {
            el.remove();
        });
        this.initVideoListners();
    }
}

export default VideoControllerEngine;
