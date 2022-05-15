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
            }
        });
    }


    getCurrentTabId(cb: any) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            cb(tabs[0].id);
        });
    }

    currentPageCallBack: (page: string) => void = null;
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

    currentRoomIdCallBack: (roomId: string) => void = null;
    getCurrentRoomId(cb: (roomId: string) => void) {
        this.currentRoomIdCallBack = cb;

        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_GET_ROOM_ID',
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