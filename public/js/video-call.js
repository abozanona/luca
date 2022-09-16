if ('AgoraRTC' in window) {
    AgoraRTC.setLogLevel(4);
    var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    var localTracks = {
        videoTrack: null,
        audioTrack: null,
    };

    var localTrackState = {
        videoTrackMuted: false,
        audioTrackMuted: false
    }

    var remoteUsers = {};

    var options = {
        appid: null,
        channel: null,
        uid: null,
        token: null
    };

    AgoraRTC.onAutoplayFailed = () => {
        alert("click to start autoplay!")
    }

    AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
        if (changedDevice.state === "ACTIVE") {
            localTracks.audioTrack.setDevice(changedDevice.device.deviceId);
        } else if (changedDevice.device.label === localTracks.audioTrack.getTrackLabel()) {
            const oldMicrophones = await AgoraRTC.getMicrophones();
            oldMicrophones[0] && localTracks.audioTrack.setDevice(oldMicrophones[0].deviceId);
        }
    }

    AgoraRTC.onCameraChanged = async (changedDevice) => {
        if (changedDevice.state === "ACTIVE") {
            localTracks.videoTrack.setDevice(changedDevice.device.deviceId);
        } else if (changedDevice.device.label === localTracks.videoTrack.getTrackLabel()) {
            const oldCameras = await AgoraRTC.getCameras();
            oldCameras[0] && localTracks.videoTrack.setDevice(oldCameras[0].deviceId);
        }
    }

    var urlParams = new URL(location.href).searchParams;
    options.appid = document.body.dataset["lucaVideoAppId"];
    options.channel = document.body.dataset["lucaVideoChannel"];
    options.token = document.body.dataset["lucaVideoToken"];
    options.uid = document.body.dataset["lucaVideoUID"];

    try {
        join().then(() => {

        });
    } catch (error) {
        console.error(error);
    }

    async function join() {

        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);

        [options.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
            client.join(options.appid, options.channel, options.token || null, options.uid || null),
            AgoraRTC.createMicrophoneAudioTrack(),
            AgoraRTC.createCameraVideoTrack()
        ]);

        localTracks.videoTrack.play("local-player");

        await client.publish(Object.values(localTracks));
        console.log("publish success");
    }

    async function leave() {
        for (trackName in localTracks) {
            var track = localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                localTracks[trackName] = undefined;
            }
        }

        remoteUsers = {};
        document.getElementById("remote-playerlist").html("");

        // leave the channel
        await client.leave();

        console.log("client leaves channel success");
    }

    async function subscribe(user, mediaType) {
        const uid = user.uid;
        // subscribe to a remote user
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === 'video') {
            const div = document.createElement('div');
            div.innerHTML = `
            <div id="luca-player-wrapper-${uid}">
              <div id="luca-player-${uid}" class="luca-player"></div>
            </div>
          `;

            // Change this to div.childNodes to support multiple top-level nodes.
            // const player = div.firstChild;
            document.getElementById("remote-playerlist").appendChild(div);
            user.videoTrack.play(`luca-player-${uid}`);
        }
        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    }

    function handleUserPublished(user, mediaType) {
        const id = user.uid;
        remoteUsers[id] = user;
        subscribe(user, mediaType);
    }

    function handleUserUnpublished(user, mediaType) {
        if (mediaType === 'video') {
            const id = user.uid;
            delete remoteUsers[id];
            document.getElementById(`luca-player-wrapper-${id}`).remove();
        }
    }

    async function toggleMuteAudio() {
        if (!localTrackState.audioTrackMuted) {
            await muteAudio();
            document.getElementById('toggle-mute-audio').innerText = "Unmute Audio";
        } else {
            await unmuteAudio();
            document.getElementById('toggle-mute-audio').innerText = "Mute Audio";
        }
    }

    async function toggleMuteVideo() {
        if (!localTrackState.videoTrackMuted) {
            await muteVideo();
            document.getElementById('toggle-mute-video').innerText = "Unmute Video";
        } else {
            await unmuteVideo();
            document.getElementById('toggle-mute-video').innerText = "Mute Video";
        }
    }

    async function muteAudio() {
        if (!localTracks.audioTrack) return;
        await localTracks.audioTrack.setMuted(true);
        localTrackState.audioTrackMuted = true;
    }

    async function muteVideo() {
        if (!localTracks.videoTrack) return;
        await localTracks.videoTrack.setMuted(true);
        localTrackState.videoTrackMuted = true;
    }

    async function unmuteAudio() {
        if (!localTracks.audioTrack) return;
        await localTracks.audioTrack.setMuted(false);
        localTrackState.audioTrackMuted = false;
    }

    async function unmuteVideo() {
        if (!localTracks.videoTrack) return;
        await localTracks.videoTrack.setMuted(false);
        localTrackState.videoTrackMuted = false;
    }

    document.getElementById('toggle-mute-video').addEventListener('click', () => {
        toggleMuteVideo();
    });
    document.getElementById('toggle-mute-audio').addEventListener('click', () => {
        toggleMuteAudio();
    });
}