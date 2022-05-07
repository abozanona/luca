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
        chrome.runtime.connect({ name: 'popup' });

        // Array.from(document.getElementsByClassName('img-avatar')).forEach((element) => {
        //     element.addEventListener('click', function (el) {
        //         document.getElementsByClassName('img-avatar-selected')[0].classList.remove('img-avatar-selected');
        //         (el.target as HTMLElement).classList.add('img-avatar-selected');
        //         let avatarName = (el.target as HTMLElement).dataset.name;
        //         chrome.storage.sync.set({ userAvatar: avatarName }, function () { });
        //     });
        // });

        // chrome.storage.sync.get('userAvatar', function (items) {
        //     let userAvatar = items.userAvatar;
        //     if (!userAvatar) {
        //         userAvatar = 'avatar-1';
        //         chrome.storage.sync.set({ userAvatar: userAvatar }, function () { });
        //     }
        //     document.querySelector('[data-name="' + userAvatar + '"]').classList.add('img-avatar-selected');
        // });

        // document.getElementById('txt-user-name').addEventListener('change', function (el) {
        //     chrome.storage.sync.set({ userName: (el.target as HTMLInputElement).value }, function () { });
        // });

        // chrome.storage.sync.get('userName', function (items) {
        //     let userName = items.userName;
        //     if (!userName) {
        //         var randomNames = [
        //             'Luca Paguro',
        //             'Alberto Scorfano',
        //             'Giulia Marcovaldo',
        //             'Ercole Visconti',
        //             'Daniela Paguro',
        //             'Massimo Marcovaldo',
        //             'Lorenzo Paguro',
        //             'Ciccio',
        //             'Guido',
        //             'Signora Marsigliese',
        //             'Tommaso',
        //             'Grandma Paguro',
        //             'Giacomo',
        //             'Concetta Aragosta',
        //             'Pinuccia Aragosta',
        //             'Uncle Ugo',
        //             'Maggiore',
        //         ];
        //         userName = randomNames[Math.floor(Math.random() * randomNames.length)];
        //         chrome.storage.sync.set({ userName: userName }, function () { });
        //     }
        //     (document.getElementById('txt-user-name') as HTMLInputElement).value = userName;
        // });

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            switch (request.code) {
                case 'A_GET_PAGE_STATUS':
                    let status = request.body.status;
                    _this.currentAction = [status, _this.currentAction].sort(
                        (a, b) => _this.actionsOrder.indexOf(b) - _this.actionsOrder.indexOf(a)
                    )[0];
                    _this.renderPopupScreen(_this.currentAction);
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

    renderPopupScreen(state: string) {
        if (this.currentPageCallBack) {
            this.currentPageCallBack(state);
        }
    }

}

export default PopUpEngine;