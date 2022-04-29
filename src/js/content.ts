import './luca/chat-engine';
import './luca/luca-engine';
import './luca/socket-engine';
import './luca/video-engine';

let chatEngine = new ChatEngine();
let lucaEngine = new LucaEngine(chatEngine);
let videoEngine = new VideoEngine();
let socketEnging = new SocketEnging(chatEngine);

chrome.runtime.onMessage.addListener(gotMessage)
function gotMessage(message: any, sender: any, sendResponse: any) {
	if (message.code == 'Q_HIGHLIGHT_ALL_VIDEOS') {
		if (SocketEnging.isSocketStarted) {
			alert("Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.")
			return;
		}
		lucaEngine.initLuca();
		document.querySelectorAll(".luca-video-highlight").forEach(el => {
			el.remove();
		});
		document.querySelectorAll('video').forEach(elVideo => {
			let divVideoHiighlight = document.createElement("div");
			divVideoHiighlight.classList.add("luca-video-highlight");
			document.body.appendChild(divVideoHiighlight);
			let coordinates = UtilsEngine.getOffset(elVideo);
			divVideoHiighlight.style.top = (coordinates.top) + 'px';
			divVideoHiighlight.style.left = (coordinates.left) + 'px';
			divVideoHiighlight.style.width = (coordinates.width - 10) + 'px';
			divVideoHiighlight.style.height = (coordinates.height - 10) + 'px';

			let spanHiighlightClose = document.createElement("div");
			spanHiighlightClose.classList.add("luca-video-highlight-close");
			spanHiighlightClose.addEventListener('click', function (e) {
				((e.target as HTMLElement).parentNode as HTMLElement).remove();
			})
			divVideoHiighlight.appendChild(spanHiighlightClose);

			let spanHiighlightPlay = document.createElement("button");
			spanHiighlightPlay.classList.add("luca-video-highlight-play");
			spanHiighlightPlay.addEventListener('click', function (e) {
				lucaEngine.injectChat();
				videoEngine.startStreamingOnVideo(elVideo);
				((e.target as HTMLElement).parentNode as HTMLElement).remove();
			})
			divVideoHiighlight.appendChild(spanHiighlightPlay);
		});
	}
	if (message.code == "Q_CLOSE_POPUP") {
		document.querySelectorAll('.luca-selected-video').forEach(el => {
			el.classList.remove('luca-selected-video');
		});
	}
	if (message.code == "Q_CREATE_NEW_ROOM_ID") {
		socketEnging.roomId = UtilsEngine.uuidv4();
	}
	if (message.code == "Q_JOIN_ROOM_ID") {
		socketEnging.roomId = message.roomId;
	}
	if (message.code == "Q_GET_PAGE_STATUS") {
		UtilsEngine.getTabId(function (tabId) {
			const message = {
				code: "A_GET_PAGE_STATUS",
				tabId: tabId,
				body: {
					status: UtilsEngine.getCurrentPageStatus()
				}
			};

			chrome.runtime.sendMessage(message);
		});
	}
}

if (document.getElementById("luca-no-extension-found") && document.getElementById("luca-extension-found")) {
	document.getElementById("luca-no-extension-found").style.display = "none";
	document.getElementById("luca-extension-found").style.display = "block";
}
