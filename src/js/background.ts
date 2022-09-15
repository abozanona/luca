import UtilsEngine from "./luca/utils-engine";

var partyTabs: any = {};

UtilsEngine.browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.code == 'Q_TAB_ID') {
        sendResponse({
            code: 'A_TAB_ID',
            body: {
                tabId: sender.tab.id,
            },
        });
    } else if (msg.code == 'Q_CREATE_PARTY_BY_INVITATION') {
        UtilsEngine.browser.tabs.create({ url: msg.body.roomLink, active: true }).then((tab) => {
            partyTabs[tab.id] = {
                roomLink: msg.body.roomLink,
                roomId: msg.body.roomId,
                videoXPath: msg.body.videoXPath,
            };
        });
    } else if (msg.code == 'Q_OPEN_PAGE_IN_POPUP') {
        // chrome.windows.create({ tabId: tab.id, type: "popup" });
        chrome.windows.create({
            focused: true,
            // tabId: tab.id,
            type: "popup",
            top: 0,
            height: 500,
            width: 100,
            left: 0,
            // url: 'https://google.com/',
            url: 'chrome-extension://malijbikcpkgkmkmememddinnklhekcj/chat.html',
        });
    }
});

UtilsEngine.browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (partyTabs[tabId] && changeInfo.status == 'complete') {
        let messageDetails = partyTabs[tabId];
        partyTabs[tabId] = undefined;
        const message = {
            code: 'Q_INIT_PAGE_WITH_PARTY',
            tabId: tabId,
            body: messageDetails,
        };
        UtilsEngine.browser.tabs.sendMessage(tabId, message);
    }
});

const manifest = UtilsEngine.browser.runtime.getManifest();
let user = {
    version: manifest.version,
};
UtilsEngine.browser.runtime.setUninstallURL(
    `https://docs.google.com/forms/d/e/1FAIpQLSchwIEPLVcl54IOHZOrQ8s_2jyWE_ea2Njk8kajZtUwPmNFcQ/viewform?entry.280944084=${user.version}`
);
