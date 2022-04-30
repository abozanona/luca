import { SocketEnging } from "./socket-engine";

export class VideoEngine {
	isVideoSelected: boolean = false;
	selectedVideo: HTMLVideoElement = null;
	allowedActions = {
		pause: 0,
		play: 0,
		seek: 0,
	};

	constructor(private socketEngine: SocketEnging) {

	}

	play() {
		if ((<any>this.selectedVideo).playing) {
			return;
		}
		this.allowedActions.play++;
		this.selectedVideo.play();
	}

	pause() {
		if (this.selectedVideo.paused) {
			return;
		}
		this.allowedActions.pause++;
		this.selectedVideo.pause();
	}

	seek(time: number) {
		if (this.selectedVideo.currentTime == time) {
			return;
		}
		this.allowedActions.seek++;
		this.selectedVideo.currentTime = time;
	}

	startStreamingOnVideo(video: HTMLVideoElement) {
		if (this.selectedVideo) {
			alert("Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.")
			return;
		}
		this.isVideoSelected = true;
		this.selectedVideo = video;
		document.querySelectorAll(".luca-video-highlight").forEach(el => {
			el.remove();
		});

		video.addEventListener('play', (event) => {
			if (this.allowedActions.play < 0) {
				this.allowedActions.play = 0;
			}
			if (this.allowedActions.play == 0) {
				this.socketEngine.sendPlayerOrder("play", {
					time: video.currentTime,
				}, null)
			}
			if (this.allowedActions.play > 0) {
				this.allowedActions.play--;
			}
		});
		video.addEventListener('pause', (event) => {
			if (this.allowedActions.pause < 0) {
				this.allowedActions.pause = 0;
			}
			if (this.allowedActions.pause == 0) {
				this.socketEngine.sendPlayerOrder("pause", {
					time: video.currentTime,
				}, null)
			}
			if (this.allowedActions.pause > 0) {
				this.allowedActions.pause--;
			}
		});
		video.addEventListener('seeked', (event) => {
			if (this.allowedActions.seek < 0) {
				this.allowedActions.seek = 0;
			}
			if (this.allowedActions.seek == 0) {
				this.socketEngine.sendPlayerOrder("seek", {
					time: video.currentTime,
				}, null)
			}
			if (this.allowedActions.seek > 0) {
				this.allowedActions.seek--;
			}
		});
	}
}