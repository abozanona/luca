chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.code == "Q_TAB_ID") {
        sendResponse({
            code: 'A_TAB_ID',
            body: {
                tabId: sender.tab.id
            }
        });
        chrome.tabs.insertCSS(sender.tab.id, {
            file: "css/page-style.css"
        });
    }
});

// chrome.runtime.onConnect.addListener(function (port) {
//     if (port.name === "popup") {
//         port.onDisconnect.addListener(function () {
//             const message = {
//                 code: "Q_CLOSE_POPUP",
//                 // tabId: tabId,
//                 body: {
//                 }
//             };
//             chrome.runtime.sendMessage(message);
//         });
//     }
// });

chrome.runtime.onMessage.addListener(function (rq, sender, sendResponse) {
    // setTimeout to simulate any callback (even from storage.sync)
    setTimeout(function () {
        sendResponse({ status: true });
    }, 1);
    return true;  // uncomment this line to fix error
});
