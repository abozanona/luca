import { LucaEngine } from "./luca-engine";
import { SocketEnging } from "./socket-engine";
import { VideoEngine } from "./video-engine";

export class UtilsEngine {
    static getTabId(cb: (a: string) => void) {
        chrome.runtime.sendMessage({ code: "Q_TAB_ID" }, res => {
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
        UtilsEngine.getUserId(function (userId: string) {
            UtilsEngine.getTabId(function (tabId) {
                cb(userId + "-in-" + tabId);
            })
        });
    }

    static getUserId(cb: (a: string) => void) {
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

    static executeUnderDifferentTabId(messagePageId: string, cb: () => void) {
        UtilsEngine.getCurrentPageId(function (currentPageId) {
            if (messagePageId == currentPageId) {
                return;
            }
            cb();
        });
    }

    static uuidv4() {
        return ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (parseInt(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> parseInt(c) / 4).toString(16)
        );
    }

    static getCurrentPageStatus() {
        if (!LucaEngine.isLucaInitted) {
            return "NOT_INIT";
        }
        if (!VideoEngine.isVideoSelected) {
            return "VIDEO_NOT_SELECTED";
        }
        if (SocketEnging.isSocketStarted) {
            return "STREAm_STARTED";
        }
    }

}