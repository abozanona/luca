var div = document.createElement("div");
div.id = "luca-selected-video-frame";
document.body.appendChild(div);

let allowedActions = {
	pause: 0,
	paly: 0,
	seek: 0,
};

const linkStyle = document.createElement("link");
linkStyle.href = chrome.runtime.getURL("css/page-style.css");
linkStyle.rel = "stylesheet";
linkStyle.type = "text/css";
document.head.appendChild(linkStyle)

function getTabId(cb) {
	chrome.runtime.sendMessage({ code: "Q_TAB_ID" }, res => {
		cb(res.body.tabId);
	});
}

function getOffset(el) {
	const rect = el.getBoundingClientRect();
	return {
		left: rect.left + window.scrollX,
		top: rect.top + window.scrollY,
		width: rect.width,
		height: rect.height,
	};
}

var allVideosList = [];
var selectedVideoId = 0;

var socket = io('https://abozanona-luca.herokuapp.com/', {
	transports: ["websocket"],
	withCredentials: false,
	path: '/socket.io'
});

function createRoom() {
	var room = "test";
	socket.emit("join", room);
}

function joinRoom() {
	socket.emit("join", room);
}

function getCurrentPageId(cb) {
	getUserId(function (userId) {
		getTabId(function (tabId) {
			cb(userId + "-in-" + tabId);
		})
	});
}

function sendPlayerorder(order, data, cb) {
	getCurrentPageId(function (pageId) {
		data.pageId = pageId;
		socket.emit(order, data);
		if (cb) {
			cb();
		}
	});
}

function executeUnderDifferentTabId(messagePageId, cb) {
	getCurrentPageId(function (currentPageId) {
		if (messagePageId == currentPageId) {
			return;
		}
		cb();
	});
}

socket.on("play", function (message) {
	executeUnderDifferentTabId(message.pageId, function () {
		if (Math.abs(allVideosList[selectedVideoId].currentTime - message.time) > 10) {
			allowedActions.seek++;
			allVideosList[selectedVideoId].currentTime = message.time;
		}
		allowedActions.paly++;
		allVideosList[selectedVideoId].play();
	})
});
socket.on("pause", function (message) {
	executeUnderDifferentTabId(message.pageId, function () {
		if (Math.abs(allVideosList[selectedVideoId].currentTime - message.time) > 10) {
			allowedActions.seek++;
			allVideosList[selectedVideoId].currentTime = message.time;
		}
		allowedActions.paly++;
		allVideosList[selectedVideoId].pause();
	});
});
socket.on("seek", function (message) {
	executeUnderDifferentTabId(message.pageId, function () {
		if (Math.abs(allVideosList[selectedVideoId].currentTime - message.time) > 10) {
			allowedActions.seek++;
			allVideosList[selectedVideoId].currentTime = message.time;
		}
	});
});

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

function getUserId(cb) {
	chrome.storage.sync.get('userid', function (items) {
		var userid = items.userid;
		if (userid) {
			cb(userid);
		} else {
			userid = uuidv4();
			chrome.storage.sync.set({ userid: userid }, function () {
				cb(userid);
			});
		}
	});
}

chrome.runtime.onMessage.addListener(gotMessage)
function gotMessage(message, sender, sendResponse) {
	if (message.code == "Q_VIDEOS_COUNT") {
		getTabId(function (tabId) {
			allVideosList = document.getElementsByTagName('video');
			let videosCount = allVideosList.length;
			const message = {
				code: "A_VIDEOS_COUNT",
				tabId: tabId,
				body: {
					videosCount: videosCount
				}
			};

			chrome.runtime.sendMessage(message);
		});
	}
	if (message.code == "Q_SELECT_VIDEO") {
		document.querySelectorAll('.luca-selected-video').forEach(el => {
			el.classList.remove('luca-selected-video');
		});
		selectedVideoId = message.body.videoId;
		let coordinates = getOffset(allVideosList[selectedVideoId]);

		document.getElementById('luca-selected-video-frame').style.top = (coordinates.top) + 'px';
		document.getElementById('luca-selected-video-frame').style.left = (coordinates.left) + 'px';
		document.getElementById('luca-selected-video-frame').style.width = (coordinates.width - 10) + 'px';
		document.getElementById('luca-selected-video-frame').style.height = (coordinates.height - 10) + 'px';

		allVideosList[message.body.videoId].classList.add("luca-selected-video");
		getTabId(function (tabId) {
			allVideosList = document.getElementsByTagName('video');
			let videosCount = allVideosList.length;
			let message = {
				code: "A_VIDEOS_COUNT",
				tabId: tabId,
				body: {
					videosCount: videosCount
				}
			};

			chrome.runtime.sendMessage(message);
		});
	}
	if (message.code == "Q_CLOSE_POPUP") {
		document.querySelectorAll('.luca-selected-video').forEach(el => {
			el.classList.remove('luca-selected-video');
		});
	}
	if (message.code == "Q_START_STREAMING_VIDEO") {
		let video = allVideosList[selectedVideoId];
		createRoom();
		video.addEventListener('play', (event) => {
			if (allowedActions.paly < 0) {
				allowedActions.paly = 0;
			}
			if (allowedActions.play > 0) {
				allowedActions.play--;
			}
			if (allowedActions.paly == 0) {
				sendPlayerorder("play", {
					time: video.currentTime,
				})
			}
		});
		video.addEventListener('pause', (event) => {
			if (allowedActions.pause < 0) {
				allowedActions.pause = 0;
			}
			if (allowedActions.pause > 0) {
				allowedActions.pause--;
			}
			if (allowedActions.pause == 0) {
				sendPlayerorder("pause", {
					time: video.currentTime,
				})
			}
		});
		video.addEventListener('seeked', (event) => {
			if (allowedActions.seek < 0) {
				allowedActions.seek = 0;
			}
			if (allowedActions.seek > 0) {
				allowedActions.seek--;
			}
			if (allowedActions.seek == 0) {
				sendPlayerorder("seek", {
					time: video.currentTime,
				})
			}
		});
	}
}