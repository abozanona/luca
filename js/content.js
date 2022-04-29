let allowedActions = {
	pause: 0,
	play: 0,
	seek: 0,
};

isLucaInitted = false;
isSocketStarted = false;

var selectedVideo;
var socket;
var roomId;

function initLuca() {
	if (isLucaInitted) {
		return;
	}
	isLucaInitted = true;
	//Add playing property to videos
	Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
		get: function () {
			return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
		}
	});

	//Add Luca style
	const linkStyle = document.createElement("link");
	linkStyle.href = chrome.runtime.getURL("css/page-style.css");
	linkStyle.rel = "stylesheet";
	linkStyle.type = "text/css";
	document.head.appendChild(linkStyle)

	//Add Luca chat container abd bubbles
	let divChatListFrame = document.createElement("div");
	divChatListFrame.id = "luca-chat-container";
	document.body.appendChild(divChatListFrame);

	let divChatMessages = document.createElement("div");
	divChatMessages.id = "luca-chat-new-message";
	document.body.appendChild(divChatMessages);
	let inputChatMessages = document.createElement("input");
	inputChatMessages.placeholder = "Enter Message here";
	divChatMessages.appendChild(inputChatMessages);

	window.addEventListener('keydown', function (e) {
		if (e.altKey == true && e.keyCode == 90/*Z*/) {
			e.preventDefault();
			let messageDiv = document.getElementById("luca-chat-new-message");
			let allMessagesDiv = document.getElementById("luca-chat-container");
			let reactionsDiv = document.getElementById("luca-reactions-container");
			if (messageDiv.style.display === "none") {
				messageDiv.style.display = "block";
				inputChatMessages.focus();
				allMessagesDiv.style.display = "block";
				reactionsDiv.style.display = "block";
			} else {
				messageDiv.style.display = "none";
				allMessagesDiv.style.display = "none";
				reactionsDiv.style.display = "none";
			}
		}
	});

	//Add Luca reactions container
	let divReactionsFrame = document.createElement("div");
	divReactionsFrame.id = "luca-reactions-container";
	document.body.appendChild(divReactionsFrame);

	["like", "love", "sad", "haha", "wow", "angry"].forEach(function (reactionImage) {
		let imgReaction = document.createElement("img");
		imgReaction.classList.add("luca-reaction");
		imgReaction.src = chrome.runtime.getURL("img/reactions/" + reactionImage + ".gif");
		imgReaction.dataset.reactionName = reactionImage;
		imgReaction.addEventListener('click', function (el) {
			el.preventDefault();
			showReactionOnScreen(el.target.dataset.reactionName);
			sendReactionToRoom(el.target.dataset.reactionName);
		});
		divReactionsFrame.appendChild(imgReaction);
	});

	//Add Luca chat and reactions lisetners
	inputChatMessages.addEventListener("keyup", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			if (inputChatMessages.value) {
				sendMessageToRoom(inputChatMessages.value);
				addMessageBubble(inputChatMessages.value);
				inputChatMessages.value = "";
			}
		}
	});

	var fullScreenElement = document.body;

	//Show elements in full screne mode
	Array.from(document.querySelectorAll("*")).forEach(element => {
		['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(ev => {
			element.addEventListener(ev, function () {
				if (fullScreenElement == null) {
					fullScreenElement = element;
				}
				else {
					if (fullScreenElement.contains(element)) {
						fullScreenElement = element;
					}
					else if (element.contains(fullScreenElement)) {
						;
					}
					else {
						fullScreenElement = element;
					}
				}
				let messageDiv = document.getElementById("luca-chat-new-message");
				let allMessagesDiv = document.getElementById("luca-chat-container");
				let reactionsDiv = document.getElementById("luca-reactions-container");
				fullScreenElement.appendChild(messageDiv);
				fullScreenElement.appendChild(allMessagesDiv);
				fullScreenElement.appendChild(reactionsDiv);
			});
		});
	})
}

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

function initSocket() {
	if (isSocketStarted) {
		alert("Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.")
		return;
	}
	isSocketStarted = true;

	socket = io('https://abozanona-luca.herokuapp.com/', {
		transports: ["websocket"],
		withCredentials: false,
		path: '/socket.io'
	});

	socket.on("play", function (message) {
		executeUnderDifferentTabId(message.pageId, function () {
			seek(message.time);
			play();
		})
	});

	socket.on("pause", function (message) {
		executeUnderDifferentTabId(message.pageId, function () {
			seek(message.time);
			pause();
		});
	});

	socket.on("seek", function (message) {
		executeUnderDifferentTabId(message.pageId, function () {
			seek(message.time);
		});
	});

	socket.on("message", function (message) {
		executeUnderDifferentTabId(message.pageId, function () {
			addMessageBubble(message.text);
		});
	});

	socket.on("reaction", function (message) {
		executeUnderDifferentTabId(message.pageId, function () {
			showReactionOnScreen(message.name);
		});
	});
}

function createRoom() {
	socket.emit("join", roomId);
}

function joinRoom() {
	socket.emit("join", roomId);
}

function getCurrentPageId(cb) {
	getUserId(function (userId) {
		getTabId(function (tabId) {
			cb(userId + "-in-" + tabId);
		})
	});
}

function sendPlayerOrder(order, data, cb) {
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

function play() {
	if (selectedVideo.playing) {
		return;
	}
	allowedActions.play++;
	selectedVideo.play();
}

function pause() {
	if (selectedVideo.paused) {
		return;
	}
	allowedActions.pause++;
	selectedVideo.pause();
}

function seek(time) {
	if (selectedVideo.currentTime == time) {
		return;
	}
	allowedActions.seek++;
	selectedVideo.currentTime = time;
}

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

function sendMessageToRoom(messageText) {
	sendPlayerOrder("message", {
		text: messageText,
	})
}

function addMessageBubble(messageText) {
	let divChatBubble = document.createElement("div");
	divChatBubble.classList.add("luca-chat-bubble");
	divChatBubble.innerText = messageText;

	let bubblesContainer = document.getElementById("luca-chat-container");
	if (bubblesContainer.firstChild) {
		bubblesContainer.insertBefore(divChatBubble, bubblesContainer.firstChild);
	} else {
		bubblesContainer.appendChild(divChatBubble);
	}
}

function sendReactionToRoom(reactionName) {
	sendPlayerOrder("reaction", {
		name: reactionName,
	})
}

function showReactionOnScreen(reactionName) {
	var getRandomInteger = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	var randomSpeeds = function () { return getRandomInteger(3000, 4000) } // The lower, the faster
	var delay = 50 // The higher, the more delay
	var startScreenPercentage = 0.03;
	var endScreenPercentage = 0.97;

	var interval

	interval = setInterval(function () {

		let imgReactionParticle = document.createElement("img");
		imgReactionParticle.classList.add("luca-reaction-particle");
		imgReactionParticle.src = chrome.runtime.getURL("img/reactions/" + reactionName + ".gif");
		imgReactionParticle.dataset.reactionName = reactionName;


		fullScreenElement.appendChild(imgReactionParticle);
		var bounds = getRandomInteger(fullScreenElement.clientWidth * startScreenPercentage, fullScreenElement.clientWidth * endScreenPercentage)
		$(imgReactionParticle).animate({ left: bounds, right: bounds }, delay, function () {
			$(imgReactionParticle).animate({ top: '-100%', opacity: 0 }, randomSpeeds(), function () {
				$(imgReactionParticle).remove()
			})
		})
		clearInterval(interval)
	}, 1)
}

function startStreamingOnVideo(video) {
	if (selectedVideo) {
		alert("Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.")
		return;
	}
	selectedVideo = video;
	document.querySelectorAll(".luca-video-highlight").forEach(el => {
		el.remove();
	});
	initSocket();
	createRoom();
	video.addEventListener('play', (event) => {
		if (allowedActions.play < 0) {
			allowedActions.play = 0;
		}
		if (allowedActions.play == 0) {
			sendPlayerOrder("play", {
				time: video.currentTime,
			})
		}
		if (allowedActions.play > 0) {
			allowedActions.play--;
		}
	});
	video.addEventListener('pause', (event) => {
		if (allowedActions.pause < 0) {
			allowedActions.pause = 0;
		}
		if (allowedActions.pause == 0) {
			sendPlayerOrder("pause", {
				time: video.currentTime,
			})
		}
		if (allowedActions.pause > 0) {
			allowedActions.pause--;
		}
	});
	video.addEventListener('seeked', (event) => {
		if (allowedActions.seek < 0) {
			allowedActions.seek = 0;
		}
		if (allowedActions.seek == 0) {
			sendPlayerOrder("seek", {
				time: video.currentTime,
			})
		}
		if (allowedActions.seek > 0) {
			allowedActions.seek--;
		}
	});
}

chrome.runtime.onMessage.addListener(gotMessage)
function gotMessage(message, sender, sendResponse) {
	if (message.code == 'Q_HIGHLIGHT_ALL_VIDEOS') {
		if (isSocketStarted) {
			alert("Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.")
			return;
		}
		initLuca();
		document.querySelectorAll(".luca-video-highlight").forEach(el => {
			el.remove();
		});
		document.querySelectorAll('video').forEach(elVideo => {
			let divVideoHiighlight = document.createElement("div");
			divVideoHiighlight.classList.add("luca-video-highlight");
			document.body.appendChild(divVideoHiighlight);
			let coordinates = getOffset(elVideo);
			divVideoHiighlight.style.top = (coordinates.top) + 'px';
			divVideoHiighlight.style.left = (coordinates.left) + 'px';
			divVideoHiighlight.style.width = (coordinates.width - 10) + 'px';
			divVideoHiighlight.style.height = (coordinates.height - 10) + 'px';

			let spanHiighlightClose = document.createElement("div");
			spanHiighlightClose.classList.add("luca-video-highlight-close");
			spanHiighlightClose.addEventListener('click', function (e) {
				e.target.parentNode.remove();
			})
			divVideoHiighlight.appendChild(spanHiighlightClose);

			let spanHiighlightPlay = document.createElement("button");
			spanHiighlightPlay.classList.add("luca-video-highlight-play");
			spanHiighlightPlay.addEventListener('click', function (e) {
				startStreamingOnVideo(elVideo);
				e.target.parentNode.remove();
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
		roomId = uuidv4();
	}
	if (message.code == "Q_JOIN_ROOM_ID") {
		roomId = message.roomId;
	}
	if (message.code == "Q_GET_PAGE_STATUS") {
		getTabId(function (tabId) {
			const message = {
				code: "A_GET_PAGE_STATUS",
				tabId: tabId,
				body: {
					status: getCurrentPageStatus()
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

function getCurrentPageStatus() {
	if (!isLucaInitted) {
		return "NOT_INIT";
	}
	if (!video) {
		return "VIDEO_NOT_SELECTED";
	}
	if (isSocketStarted) {
		return "STREAm_STARTED";
	}
}

function sendAction() {

}