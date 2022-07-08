import { ChatEngine } from './luca/chat-engine';
import { LucaEngine } from './luca/luca-engine';
import SharePartyPage from './luca/share-party-page';
import { SocketEngine } from './luca/socket-engine';
import { UtilsEngine } from './luca/utils-engine';
import VideoControllerEngine from './luca/video-controller-engine';
import GeneralVideoController from './luca/video-controllers/general-video-controller';
import NetflixVideoController from './luca/video-controllers/netflix-video-controller';

class ContentPageScript {

    chatEngine: ChatEngine;
    socketEngine: SocketEngine;
    videoController: VideoControllerEngine;
    lucaEngine: LucaEngine;

    constructor() {
        this.chatEngine = new ChatEngine();
        this.socketEngine = new SocketEngine(this.chatEngine);
        if (document.location.origin.includes('netflix.com')) {
            this.videoController = new NetflixVideoController(this.socketEngine);
        } else {
            this.videoController = new GeneralVideoController(this.socketEngine);
        }

        this.lucaEngine = new LucaEngine(this.chatEngine, this.socketEngine, this.videoController);

        this.lucaEngine.initLuca();

        UtilsEngine.browser.runtime.onMessage.addListener(this.gotMessage.bind(this));

        new SharePartyPage().initLucaJoinParty();
    }

    startPartyOnVideo(videoElement: HTMLVideoElement) {
        this.lucaEngine.injectChat();
        if (document.location.origin.includes('netflix.com')) {
        } else {
            (this.videoController as GeneralVideoController).setVideo(videoElement);
        }
        this.videoController.startStreamingOnVideo();
        this.videoController.videoXPath = UtilsEngine.getXPathTo(videoElement);
    }

    gotMessage(message: any, sender: any, sendResponse: any) {
        let _this = this;
        switch (message.code) {
            case 'Q_HIGHLIGHT_ALL_VIDEOS':
                if (this.videoController.isVideoSelected) {
                    alert(UtilsEngine.translate('ALERT_PARTY_ALREADY_RUNNING'));
                    return;
                }
                document.querySelectorAll('.luca-video-highlight').forEach((el) => {
                    el.remove();
                });
                document.querySelectorAll('video').forEach((elVideo) => {
                    let divVideoHiighlight = document.createElement('div');
                    divVideoHiighlight.classList.add('luca-video-highlight');

                    document.body.appendChild(divVideoHiighlight);

                    let coordinates = UtilsEngine.getOffset(elVideo);
                    divVideoHiighlight.style.top = coordinates.top + 'px';
                    divVideoHiighlight.style.left = coordinates.left + 'px';
                    divVideoHiighlight.style.width = coordinates.width - 10 + 'px';
                    divVideoHiighlight.style.height = coordinates.height - 10 + 'px';

                    let spanHiighlightClose = document.createElement('div');
                    spanHiighlightClose.classList.add('luca-video-highlight-close');
                    spanHiighlightClose.addEventListener('click', function (e) {
                        ((e.target as HTMLElement).parentNode as HTMLElement).remove();
                    });
                    divVideoHiighlight.appendChild(spanHiighlightClose);

                    let spanHiighlightPlay = document.createElement('button');
                    spanHiighlightPlay.classList.add('luca-video-highlight-play');
                    spanHiighlightPlay.addEventListener('click', function (e) {
                        _this.startPartyOnVideo(elVideo);
                        ((e.target as HTMLElement).parentNode as HTMLElement).remove();
                    });
                    divVideoHiighlight.appendChild(spanHiighlightPlay);
                });
                break;
            case 'Q_CLOSE_POPUP':
                document.querySelectorAll('.luca-selected-video').forEach((el) => {
                    el.classList.remove('luca-selected-video');
                });
                break;
            case 'Q_CREATE_NEW_ROOM_ID':
                this.socketEngine.createRoom(this.videoController, this.lucaEngine, UtilsEngine.uuid());
                break;
            case 'Q_JOIN_ROOM_ID':
                this.socketEngine.roomId = message.roomId;
                this.socketEngine.joinRoom(this.videoController, this.lucaEngine, this.socketEngine.roomId);
                if (this.videoController.videoXPath) {
                    let videoElement: HTMLVideoElement = document.evaluate(
                        this.videoController.videoXPath,
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue as HTMLVideoElement;
                    if (videoElement) {
                        this.startPartyOnVideo(videoElement);
                    }
                }
                break;
            case 'Q_GET_ROOM_ID':
                UtilsEngine.getTabId().then(function (tabId) {
                    const message = {
                        code: 'A_GET_ROOM_ID',
                        tabId: tabId,
                        body: {
                            roomId: _this.socketEngine.roomId,
                        },
                    };
                    UtilsEngine.browser.runtime.sendMessage(message);
                });
                break;
            case 'Q_GET_VIDEO_XPATH':
                UtilsEngine.getTabId().then(function (tabId) {
                    const message = {
                        code: 'A_GET_VIDEO_XPATH',
                        tabId: tabId,
                        body: {
                            videoXPath: _this.videoController.videoXPath,
                        },
                    };
                    UtilsEngine.browser.runtime.sendMessage(message);
                });
                break;
            case 'Q_GET_PAGE_STATUS':
                UtilsEngine.getTabId().then(function (tabId) {
                    const message = {
                        code: 'A_GET_PAGE_STATUS',
                        tabId: tabId,
                        body: {
                            status: _this.lucaEngine.getCurrentPageStatus(),
                        },
                    };
                    UtilsEngine.browser.runtime.sendMessage(message);
                });
                break;
            case 'Q_INIT_PAGE_WITH_PARTY':
                let roomId = message.body.roomId;
                this.socketEngine.roomId = roomId;
                this.socketEngine.joinRoom(this.videoController, this.lucaEngine, this.socketEngine.roomId);
                if (message.body.videoXPath) {
                    this.videoController.videoXPath = message.body.videoXPath;
                    let videoElement: HTMLVideoElement = document.evaluate(
                        message.body.videoXPath,
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    ).singleNodeValue as HTMLVideoElement;
                    if (videoElement) {
                        this.startPartyOnVideo(videoElement);
                    }
                }
                break;
            case 'Q_GET_PARTY_USERS':
                UtilsEngine.getTabId().then(function (tabId) {
                    const message = {
                        code: 'A_GET_PARTY_USERS',
                        tabId: tabId,
                        body: {
                            users: _this.socketEngine.currentUsers,
                        },
                    };
                    UtilsEngine.browser.runtime.sendMessage(message);
                });
                break;
        }
    }
}

new ContentPageScript();