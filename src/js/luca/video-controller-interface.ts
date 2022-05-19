
export interface VideoControllerInterface {

    playVideo(): void;

    isVideoPaused(): boolean;

    isVideoPlaying(): boolean;

    pauseVideo(): void;

    seekVideo(time: number): void;

    getCurrentVideoTime(): number;

    initVideoListners(): void;

}

export default VideoControllerInterface;