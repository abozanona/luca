import { UserInterface } from "./luca/interfaces/user.interface";

class PopUpEngine {

    actionsOrder = ['NOTHING', 'WAITING_CREATE_ROOM', 'WAITING_SELECT_VIDEO', 'ROOM_SETUP_COMPLETED'];
    currentAction = 'NOTHING';

    constructor() {
        this.initEvents();
    }

    createRoom() {
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_CREATE_NEW_ROOM_ID',
            };
            chrome.tabs.sendMessage(tabId, message);
        });
    }

    joinRoom(roomId: string) {
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_JOIN_ROOM_ID',
                roomId,
            };
            chrome.tabs.sendMessage(tabId, message);
        });
    }

    highlightPageVideos() {
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_HIGHLIGHT_ALL_VIDEOS',
            };
            chrome.tabs.sendMessage(tabId, message);
        });
    }

    initEvents() {
        let _this = this;
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            switch (request.code) {
                case 'A_GET_PAGE_STATUS':
                    let status = request.body.status;
                    _this.currentAction = [status, _this.currentAction].sort(
                        (a, b) => _this.actionsOrder.indexOf(b) - _this.actionsOrder.indexOf(a)
                    )[0];
                    _this.renderPopupScreen(_this.currentAction);
                    break;
                case 'A_GET_ROOM_ID':
                    if (_this.currentRoomIdCallBack) {
                        _this.currentRoomIdCallBack(request.body.roomId);
                    }
                    break;
                case 'A_GET_VIDEO_XPATH':
                    if (_this.currentRoomVideoXPathCallBack) {
                        _this.currentRoomVideoXPathCallBack(request.body.videoXPath);
                    }
                    break;
                case 'A_GET_PARTY_USERS':
                    if (_this.currentRoomUsersCallBack) {
                        _this.currentRoomUsersCallBack(request.body.users);
                    }
                    break;
            }
        });
    }

    getCurrentTabId(cb: any) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            cb(tabs[0].id);
        });
    }

    currentPageCallBack: (page: string) => void;
    getCurrentPageStatus(cb: (page: string) => void) {
        this.currentPageCallBack = cb;

        this.currentAction = 'NOTHING';
        this.renderPopupScreen(this.currentAction);
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_GET_PAGE_STATUS',
            };
            chrome.tabs.sendMessage(tabId, message);
        });
    }

    currentRoomIdCallBack: (roomId: string) => void;
    getCurrentRoomId(cb: (roomId: string) => void) {
        this.currentRoomIdCallBack = cb;

        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_GET_ROOM_ID',
            };
            chrome.tabs.sendMessage(tabId, message);
        });
    }

    currentRoomVideoXPathCallBack: (videoXPath: string) => void;
    currentRoomVideoXPath(cb: (videoXPath: string) => void) {
        this.currentRoomVideoXPathCallBack = cb;

        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_GET_VIDEO_XPATH',
            };
            chrome.tabs.sendMessage(tabId, message);
        });
    }

    currentRoomUrlCallBack: (roomUrl: string) => void;
    getCurrentRoomUrl(cb: (roomUrl: string) => void) {
        this.currentRoomUrlCallBack = cb;
        let _this = this;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url;
            _this.currentRoomUrlCallBack(url);
        });
    }

    currentRoomUsersCallBack: (users: UserInterface[]) => void;
    getCurrentRoomUsers(cb: (users: UserInterface[]) => void) {
        this.currentRoomUsersCallBack = cb;

        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_GET_PARTY_USERS',
            };
            chrome.tabs.sendMessage(tabId, message);
        });
    }

    renderPopupScreen(state: string) {
        if (this.currentPageCallBack) {
            this.currentPageCallBack(state);
        }
    }

}

export default PopUpEngine;