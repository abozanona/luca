chrome.runtime.connect({ name: "popup" });

function getCurrentTabId(cb) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		cb(tabs[0].id);
	});
}

document.getElementById("btn-count-video-tags").addEventListener("click", function (event) {
	getCurrentTabId(function (tabId) {
		const message = {
			code: 'Q_VIDEOS_COUNT'
		}
		chrome.tabs.sendMessage(tabId, message);
	});
});

document.getElementById("btn-start-streaming").addEventListener("click", function (event) {
	getCurrentTabId(function (tabId) {
		const message = {
			code: 'Q_START_STREAMING_VIDEO'
		}
		chrome.tabs.sendMessage(tabId, message);
	});
});

var selectMovies = document.getElementById('slct-videos-available');
selectMovies.addEventListener('change', function (event) {
	const message = {
		code: 'Q_SELECT_VIDEO',
		body: {
			videoId: event.target.value,
		}
	};
	getCurrentTabId(function (tabId) {
		chrome.tabs.sendMessage(tabId, message);
	});
});
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.code == "A_VIDEOS_COUNT") {
			let videosCount = request.body.videosCount;
			document.getElementById("txt-count-video-tags").innerText = videosCount;
			document.querySelectorAll('#slct-videos-available option').forEach(option => option.remove())
			selectMovies.add(new Option("Select video", 'select-video'));
			for (let i = 0; i < videosCount; i++) {
				selectMovies.add(new Option("Video #" + (i + 1), i));
			}
		}
	}
);