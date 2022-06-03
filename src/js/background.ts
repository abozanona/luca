
var partyTabs: any = {};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.code == 'Q_TAB_ID') {
        sendResponse({
            code: 'A_TAB_ID',
            body: {
                tabId: sender.tab.id,
            },
        });
    } else if (msg.code == 'Q_CREATE_PARTY_BY_INVITATION') {
        chrome.tabs.create({ url: msg.body.roomLink, active: true }).then((tab) => {
            partyTabs[tab.id] = {
                roomLink: msg.body.roomLink,
                roomId: msg.body.roomId,
                videoXPath: msg.body.videoXPath,
            };
        });
    }
});

chrome.runtime.onMessage.addListener(function (rq, sender, sendResponse) {
    setTimeout(function () {
        sendResponse({ status: true });
    }, 1);
    return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (partyTabs[tabId] && changeInfo.status == 'complete') {
        let messageDetails = partyTabs[tabId];
        partyTabs[tabId] = undefined;
        const message = {
            code: 'Q_INIT_PAGE_WITH_PARTY',
            tabId: tabId,
            body: messageDetails,
        };
        chrome.tabs.sendMessage(tabId, message);
    }
});

const manifest = chrome.runtime.getManifest();
let user = {
    version: manifest.version,
};
chrome.runtime.setUninstallURL(
    `https://docs.google.com/forms/d/e/1FAIpQLSchwIEPLVcl54IOHZOrQ8s_2jyWE_ea2Njk8kajZtUwPmNFcQ/viewform?entry.280944084=${user.version}`
);
