import UserEngine from "./user-engine";

export class UtilsEngine {
    static refreshPage() {
        location.reload();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    }
    static getTabId(cb: (a: string) => void) {
        chrome.runtime.sendMessage({ code: 'Q_TAB_ID' }, (res) => {
            cb(res.body.tabId);
        });
    }

    static getOffset(el: HTMLElement) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height,
        };
    }

    static getCurrentPageId(cb: (a: string) => void) {
        UserEngine.getUserId().then(function (userId: string) {
            UtilsEngine.getTabId(function (tabId) {
                cb(userId + '-in-' + tabId);
            });
        });
    }

    static executeUnderDifferentTabId(messagePageId: string, cb: () => void) {
        UtilsEngine.getCurrentPageId(function (currentPageId) {
            if (messagePageId == currentPageId) {
                return;
            }
            cb();
        });
    }

    static uuid() {
        return ('' + 1e8).replace(/[018]/g, (c) =>
            (parseInt(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (parseInt(c) / 4)))).toString(16)
        );
    }
}

export default UtilsEngine;