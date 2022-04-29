chrome.runtime.connect({ name: "popup" });

function getCurrentTabId(cb: any) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		cb(tabs[0].id);
	});
}

document.getElementById("btn-highlight-page-videos").addEventListener("click", function (event) {
	getCurrentTabId(function (tabId: any) {
		const message = {
			code: 'Q_HIGHLIGHT_ALL_VIDEOS',
		}
		chrome.tabs.sendMessage(tabId, message);
	});
});

document.getElementById("btn-create-new-room").addEventListener("click", function (event) {
	getCurrentTabId(function (tabId: any) {
		const message = {
			code: 'Q_CREATE_NEW_ROOM_ID',
		}
		chrome.tabs.sendMessage(tabId, message);
	});
});

document.getElementById("btn-join-room").addEventListener("click", function (event) {
	getCurrentTabId(function (tabId: any) {
		const message = {
			code: 'Q_JOIN_ROOM_ID',
			roomId: (document.getElementById("txt-room-id") as HTMLInputElement).value,
		}
		chrome.tabs.sendMessage(tabId, message);
	});
});

Array.from(document.getElementsByClassName("img-avatar")).forEach(element => {
	element.addEventListener("click", function (el) {
		document.getElementsByClassName("img-avatar-selected")[0].classList.remove('img-avatar-selected');
		(el.target as HTMLElement).classList.add('img-avatar-selected');
		let avatarName = (el.target as HTMLElement).dataset.name;
		chrome.storage.sync.set({ userAvatar: avatarName }, function () {

		});
	});
});

chrome.storage.sync.get('userAvatar', function (items) {
	let userAvatar = items.userAvatar;
	if (!userAvatar) {
		userAvatar = 'avatar-1';
		chrome.storage.sync.set({ userAvatar: userAvatar }, function () {

		});
	}
	document.querySelector("[data-name=\"" + userAvatar + "\"]").classList.add("img-avatar-selected");
});

document.getElementById("txt-user-name").addEventListener("change", function (el) {
	chrome.storage.sync.set({ userName: (el.target as HTMLInputElement).value }, function () {

	});
});

chrome.storage.sync.get('userName', function (items) {
	let userName = items.userName;
	if (!userName) {
		var randomNames = ['Luca Paguro', 'Alberto Scorfano', 'Giulia Marcovaldo', 'Ercole Visconti', 'Daniela Paguro', 'Massimo Marcovaldo', 'Lorenzo Paguro', 'Ciccio', 'Guido', 'Signora Marsigliese', 'Tommaso', 'Grandma Paguro', 'Giacomo', 'Concetta Aragosta', 'Pinuccia Aragosta', 'Uncle Ugo', 'Maggiore'];

		userName = randomNames[Math.floor(Math.random() * randomNames.length)];
		chrome.storage.sync.set({ userName: userName }, function () {

		});
	}
	(document.getElementById("txt-user-name") as HTMLInputElement).value = userName;
});

function getCurrentPageStatus() {
	getCurrentTabId(function (tabId: any) {
		const message = {
			code: 'Q_GET_PAGE_STATUS'
		}
		chrome.tabs.sendMessage(tabId, message);
	});
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.code == "A_GET_PAGE_STATUS") {
			let status = request.body.status;
			console.log(status);
		}
	}
);