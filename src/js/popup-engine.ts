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

    //Names are generated thanks to https://blog.reedsy.com/character-name-generator/
    getCurrentUserName(cb: (name: string) => void) {
        chrome.storage.sync.get('userName', function (items) {
            let userName = items.userName;
            if (userName) {
                cb(userName);
                return;
            }
            var randomNames = [
                'Xandyr the elf',
                'Raelle the elf',
                'Pollo the elf',
                'Wex the elf',
                'Solina the elf',
                'Balon the dragon',
                'Kolloth the dragon',
                'Tren the dragon',
                'Axan the dragon',
                'Naga the dragon',
                'Shalana the champ',
                'Leandra the champ',
                'Finhad the champ',
                'Giliel the champ',
                'Amrond the champ',
                'Dracul the villan',
                'Kedron the villan',
                'Edana the villan',
                'Brenna the villan',
                'Gorgon the villan',
                'Kahraman the superhero',
                'Lucinda the superhero',
                'Manning the superhero',
                'Gunnar the superhero',
                'Botilda the superhero',
                'Aanya the sidekick',
                'Creda the sidekick',
                'Ervin the sidekick',
                'Leya the sidekick',
                'Etel the sidekick',
                'Konrad the mentor',
                'Orela the mentor',
                'Eldred the mentor',
                'Zilya the mentor',
                'Kendry the mentor'
            ];
            userName = randomNames[Math.floor(Math.random() * randomNames.length)];
            chrome.storage.sync.set({ userName: userName }, function () { });
            cb(userName);
        });
    }

    setCurrentUserName(newName: string) {
        chrome.storage.sync.set({ userName: newName }, function () { });
    }
}

export default PopUpEngine;