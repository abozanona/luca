document.getElementById('luca-chat-outer-toggle').addEventListener('click', function (e) {
    e.stopPropagation();
});
document.getElementById('luca-chat-send-message-button').addEventListener('click', function (e) {
    e.stopPropagation();
});
Array.from(document.getElementsByClassName('luca-reaction')).forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});
['click', 'keydown', 'keypress', 'keyup'].forEach(function (ev) {
    document.getElementById('luca-input-field').addEventListener(ev, function (e) {
        if (e.altKey == true && e.keyCode == 90 /*Z*/) {
            return;
        }
        e.stopPropagation();
    });
});

function selectedVideo() {
    let api = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    let playerId = api.getAllPlayerSessionIds().find(((val) => val.includes("watch")));
    let player = api.getVideoPlayerBySessionId(playerId)
    return player;
}

function generateEventData() {
    return {
        isPlayed: selectedVideo().isPlaying(),
        isPaused: selectedVideo().isPaused(),
        currentTime: selectedVideo().getCurrentTime(),
    };
}

if (document.location.origin.includes('netflix.com')) {
    var lastCurrentTime = 0;

    selectedVideo().addEventListener('playingchanged', (event) => {
        if (selectedVideo().isPlaying()) {
            document.body.dispatchEvent(new CustomEvent('videoplay', { detail: generateEventData() }));
        } else if (selectedVideo().isPaused()) {
            document.body.dispatchEvent(new CustomEvent('videopause', { detail: generateEventData() }));
        }
    });
    selectedVideo().addEventListener('currenttimechanged', (event) => {
        if (Math.abs(lastCurrentTime - selectedVideo().getCurrentTime()) > 3000) {
            document.body.dispatchEvent(new CustomEvent('videotimechange', { detail: generateEventData() }));
        }
        lastCurrentTime = selectedVideo().getCurrentTime();
    });

    document.body.addEventListener("playVideo", function (ev) {
        selectedVideo().play();
    });
    document.body.addEventListener("pauseVideo", function (ev) {
        selectedVideo().pause()
    });
    document.body.addEventListener("seekVideo", function (ev) {
        lastCurrentTime = ev.detail.time;
        selectedVideo().seek(ev.detail.time);
    });
}