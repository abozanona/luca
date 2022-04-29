class SocketEnging {
	static isSocketStarted = false;
	socket = null;
	roomId = null;

	initSocket() {
		if (SocketEnging.isSocketStarted) {
			alert("Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.")
			return;
		}
		SocketEnging.isSocketStarted = true;

		this.socket = io('https://abozanona-luca.herokuapp.com/', {
			transports: ["websocket"],
			withCredentials: false,
			path: '/socket.io'
		});

		this.socket.on("play", function (message) {
			UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
				videoEngine.seek(message.time);
				videoEngine.play();
			})
		});

		this.socket.on("pause", function (message) {
			UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
				videoEngine.seek(message.time);
				videoEngine.pause();
			});
		});

		this.socket.on("seek", function (message) {
			UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
				videoEngine.seek(message.time);
			});
		});

		this.socket.on("message", function (message) {
			UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
				chatEngine.addMessageBubble(message.text);
			});
		});

		this.socket.on("reaction", function (message) {
			UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
				lucaEngine.showReactionOnScreen(message.name);
			});
		});
	}

	createRoom() {
		this.socket.emit("join", this.roomId);
	}

	joinRoom() {
		this.socket.emit("join", this.roomId);
	}

	sendPlayerOrder(order, data, cb) {
		let _this = this;
		UtilsEngine.getCurrentPageId(function (pageId) {
			data.pageId = pageId;
			_this.socket.emit(order, data);
			if (cb) {
				cb();
			}
		});
	}

}

class LucaEngine {
	static isLucaInitted = false;
	fullScreenElement = document.body

	initLuca() {
		if (LucaEngine.isLucaInitted) {
			return;
		}
		LucaEngine.isLucaInitted = true;

		this.addVideoProperty();

		this.injectStyle();

		this.injectChat();
	}

	addVideoProperty() {
		//Add playing property to videos
		Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
			get: function () {
				return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
			}
		});
	}

	injectStyle() {
		const linkStyle = document.createElement("link");
		linkStyle.href = chrome.runtime.getURL("css/page-style.css");
		linkStyle.rel = "stylesheet";
		linkStyle.type = "text/css";
		document.head.appendChild(linkStyle)
	}

	injectChat() {
		let _this = this;
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
				_this.showReactionOnScreen(el.target.dataset.reactionName);
				chatEngine.sendReactionToRoom(el.target.dataset.reactionName);
			});
			divReactionsFrame.appendChild(imgReaction);
		});

		//Add Luca chat and reactions lisetners
		inputChatMessages.addEventListener("keyup", function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				if (inputChatMessages.value) {
					chatEngine.sendMessageToRoom(inputChatMessages.value);
					chatEngine.addMessageBubble(inputChatMessages.value);
					inputChatMessages.value = "";
				}
			}
		});

		//Show elements in full screne mode
		Array.from(document.querySelectorAll("*")).forEach(element => {
			['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(ev => {
				element.addEventListener(ev, function () {
					if (this.fullScreenElement == null) {
						this.fullScreenElement = element;
					}
					else {
						if (this.fullScreenElement.contains(element)) {
							this.fullScreenElement = element;
						}
						else if (element.contains(this.fullScreenElement)) {
							;
						}
						else {
							this.fullScreenElement = element;
						}
					}
					let messageDiv = document.getElementById("luca-chat-new-message");
					let allMessagesDiv = document.getElementById("luca-chat-container");
					let reactionsDiv = document.getElementById("luca-reactions-container");
					this.fullScreenElement.appendChild(messageDiv);
					this.fullScreenElement.appendChild(allMessagesDiv);
					this.fullScreenElement.appendChild(reactionsDiv);
				});
			});
		})
	}

	showReactionOnScreen(reactionName) {
		var getRandomInteger = function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min
		}

		var randomSpeeds = function () { return getRandomInteger(3000, 4000) } // The lower, the faster
		var delay = 50 // The higher, the more delay
		var startScreenPercentage = 0.03;
		var endScreenPercentage = 0.97;

		var interval

		let _this = this;
		interval = setInterval(function () {

			let imgReactionParticle = document.createElement("img");
			imgReactionParticle.classList.add("luca-reaction-particle");
			imgReactionParticle.src = chrome.runtime.getURL("img/reactions/" + reactionName + ".gif");
			imgReactionParticle.dataset.reactionName = reactionName;


			_this.fullScreenElement.appendChild(imgReactionParticle);
			var bounds = getRandomInteger(_this.fullScreenElement.clientWidth * startScreenPercentage, _this.fullScreenElement.clientWidth * endScreenPercentage)
			$(imgReactionParticle).animate({ left: bounds, right: bounds }, delay, function () {
				$(imgReactionParticle).animate({ top: '-100%', opacity: 0 }, randomSpeeds(), function () {
					$(imgReactionParticle).remove()
				})
			})
			clearInterval(interval)
		}, 1)
	}
}

class ChatEngine {
	sendMessageToRoom(messageText) {
		socketEnging.sendPlayerOrder("message", {
			text: messageText,
		})
	}

	addMessageBubble(messageText) {
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

	sendReactionToRoom(reactionName) {
		socketEnging.sendPlayerOrder("reaction", {
			name: reactionName,
		})
	}
}

class UtilsEngine {
	static getTabId(cb) {
		chrome.runtime.sendMessage({ code: "Q_TAB_ID" }, res => {
			cb(res.body.tabId);
		});
	}

	static getOffset(el) {
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left + window.scrollX,
			top: rect.top + window.scrollY,
			width: rect.width,
			height: rect.height,
		};
	}

	static getCurrentPageId(cb) {
		UtilsEngine.getUserId(function (userId) {
			UtilsEngine.getTabId(function (tabId) {
				cb(userId + "-in-" + tabId);
			})
		});
	}

	static getUserId(cb) {
		chrome.storage.sync.get('userid', function (items) {
			var userid = items.userid;
			if (userid) {
				cb(userid);
			} else {
				userid = UtilsEngine.uuidv4();
				chrome.storage.sync.set({ userid: userid }, function () {
					cb(userid);
				});
			}
		});
	}

	static executeUnderDifferentTabId(messagePageId, cb) {
		UtilsEngine.getCurrentPageId(function (currentPageId) {
			if (messagePageId == currentPageId) {
				return;
			}
			cb();
		});
	}

	static uuidv4() {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	}

	static getCurrentPageStatus() {
		if (!LucaEngine.isLucaInitted) {
			return "NOT_INIT";
		}
		if (!videoEngine.selectedVideo) {
			return "VIDEO_NOT_SELECTED";
		}
		if (SocketEnging.isSocketStarted) {
			return "STREAm_STARTED";
		}
	}

}

class VideoEngine {
	selectedVideo = null;
	allowedActions = {
		pause: 0,
		play: 0,
		seek: 0,
	};

	play() {
		if (this.selectedVideo.playing) {
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

	seek(time) {
		if (this.selectedVideo.currentTime == time) {
			return;
		}
		this.allowedActions.seek++;
		this.selectedVideo.currentTime = time;
	}

	startStreamingOnVideo(video) {
		if (this.selectedVideo) {
			alert("Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.")
			return;
		}
		this.selectedVideo = video;
		document.querySelectorAll(".luca-video-highlight").forEach(el => {
			el.remove();
		});
		socketEnging.initSocket();
		socketEnging.createRoom();

		video.addEventListener('play', (event) => {
			if (this.allowedActions.play < 0) {
				this.allowedActions.play = 0;
			}
			if (this.allowedActions.play == 0) {
				socketEnging.sendPlayerOrder("play", {
					time: video.currentTime,
				})
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
				socketEnging.sendPlayerOrder("pause", {
					time: video.currentTime,
				})
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
				socketEnging.sendPlayerOrder("seek", {
					time: video.currentTime,
				})
			}
			if (this.allowedActions.seek > 0) {
				this.allowedActions.seek--;
			}
		});
	}
}

let socketEnging = new SocketEnging();
let lucaEngine = new LucaEngine();
let videoEngine = new VideoEngine();
let chatEngine = new ChatEngine();

chrome.runtime.onMessage.addListener(gotMessage)
function gotMessage(message, sender, sendResponse) {
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
				e.target.parentNode.remove();
			})
			divVideoHiighlight.appendChild(spanHiighlightClose);

			let spanHiighlightPlay = document.createElement("button");
			spanHiighlightPlay.classList.add("luca-video-highlight-play");
			spanHiighlightPlay.addEventListener('click', function (e) {
				lucaEngine.injectChat();
				videoEngine.startStreamingOnVideo(elVideo);
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
