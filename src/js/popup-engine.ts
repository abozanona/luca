import { UserInterface } from './luca/interfaces/user.interface';
import UtilsEngine from './luca/utils-engine';

class PopUpEngine {
    actionsOrder = ['NOTHING', 'WAITING_CREATE_ROOM', 'WAITING_SELECT_VIDEO', 'ROOM_SETUP_COMPLETED', 'PARTY_DISCONNECTED'];
    currentAction = 'NOTHING';

    constructor() {
        this.initEvents();
    }

    public createRoom() {
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_CREATE_NEW_ROOM_ID',
            };
            UtilsEngine.browser.tabs.sendMessage(tabId, message);
        });
    }

    public joinRoom(roomId: string) {
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_JOIN_ROOM_ID',
                roomId,
            };
            UtilsEngine.browser.tabs.sendMessage(tabId, message);
        });
    }

    public highlightPageVideos() {
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_HIGHLIGHT_ALL_VIDEOS',
            };
            UtilsEngine.browser.tabs.sendMessage(tabId, message);
        });
    }

    private initEvents() {
        let _this = this;
        UtilsEngine.browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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

    private getCurrentTabId(cb: any) {
        UtilsEngine.browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            cb(tabs[0].id);
        });
    }

    private currentPageCallBack: (page: string) => void;
    public getCurrentPageStatus(cb: (page: string) => void) {
        this.currentPageCallBack = cb;

        this.currentAction = 'NOTHING';
        this.renderPopupScreen(this.currentAction);
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_GET_PAGE_STATUS',
            };
            UtilsEngine.browser.tabs.sendMessage(tabId, message);
        });
    }

    private currentRoomIdCallBack: (roomId: string) => void;
    public getCurrentRoomId(cb: (roomId: string) => void) {
        this.currentRoomIdCallBack = cb;

        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_GET_ROOM_ID',
            };
            UtilsEngine.browser.tabs.sendMessage(tabId, message);
        });
    }

    private currentRoomVideoXPathCallBack: (videoXPath: string) => void;
    public currentRoomVideoXPath(cb: (videoXPath: string) => void) {
        this.currentRoomVideoXPathCallBack = cb;

        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_GET_VIDEO_XPATH',
            };
            UtilsEngine.browser.tabs.sendMessage(tabId, message);
        });
    }

    private currentRoomUrlCallBack: (roomUrl: string) => void;
    public getCurrentRoomUrl(cb: (roomUrl: string) => void) {
        this.currentRoomUrlCallBack = cb;
        let _this = this;
        UtilsEngine.browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url;
            _this.currentRoomUrlCallBack(url);
        });
    }

    private currentRoomUsersCallBack: (users: UserInterface[]) => void;
    public getCurrentRoomUsers(cb: (users: UserInterface[]) => void) {
        this.currentRoomUsersCallBack = cb;

        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_GET_PARTY_USERS',
            };
            UtilsEngine.browser.tabs.sendMessage(tabId, message);
        });
    }

    public renderPopupScreen(state: string) {
        if (this.currentPageCallBack) {
            this.currentPageCallBack(state);
        }
    }

    public leaveParty() {
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_LEAVE_PARTY',
            };
            UtilsEngine.browser.tabs.sendMessage(tabId, message);
        });
    }

    public scanVideos() {
        this.getCurrentTabId(function (tabId: any) {
            const message = {
                code: 'Q_HIGHLIGHT_NEW_VIDEOS',
            };
            UtilsEngine.browser.tabs.sendMessage(tabId, message);
        });
    }

}

export default PopUpEngine;
