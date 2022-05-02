chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.code == 'Q_TAB_ID') {
        sendResponse({
            code: 'A_TAB_ID',
            body: {
                tabId: sender.tab.id,
            },
        });
    }
});

chrome.runtime.onMessage.addListener(function (rq, sender, sendResponse) {
    setTimeout(function () {
        sendResponse({ status: true });
    }, 1);
    return true;
});
