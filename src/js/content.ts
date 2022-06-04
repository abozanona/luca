import { ChatEngine } from './luca/chat-engine';
import { LucaEngine } from './luca/luca-engine';
import SharePartyPage from './luca/share-party-page';
import { SocketEngine } from './luca/socket-engine';
import { UtilsEngine } from './luca/utils-engine';
import VideoControllerEngine from './luca/video-controller-engine';
import GeneralVideoController from './luca/video-controllers/general-video-controller';
import NetflixVideoController from './luca/video-controllers/netflix-video-controller';

let chatEngine: ChatEngine = new ChatEngine();
let socketEngine: SocketEngine = new SocketEngine(chatEngine);
let videoController: VideoControllerEngine;
if (document.location.origin.includes('netflix.com')) {
    videoController = new NetflixVideoController(socketEngine);
} else {
    videoController = new GeneralVideoController(socketEngine);
}

let lucaEngine: LucaEngine = new LucaEngine(chatEngine, socketEngine, videoController);

lucaEngine.initLuca();

chrome.runtime.onMessage.addListener(gotMessage);

new SharePartyPage().initLucaJoinParty();

function startPartyOnVideo(videoElement: HTMLVideoElement) {
    lucaEngine.injectChat();
    if (document.location.origin.includes('netflix.com')) {
    } else {
        (videoController as GeneralVideoController).setVideo(videoElement);
    }
    videoController.startStreamingOnVideo();
    videoController.videoXPath = UtilsEngine.getXPathTo(videoElement);
}

function gotMessage(message: any, sender: any, sendResponse: any) {
    switch (message.code) {
        case 'Q_HIGHLIGHT_ALL_VIDEOS':
            if (videoController.isVideoSelected) {
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
                    startPartyOnVideo(elVideo);
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
            socketEngine.createRoom(videoController, UtilsEngine.uuid());
            break;
        case 'Q_JOIN_ROOM_ID':
            socketEngine.roomId = message.roomId;
            socketEngine.joinRoom(videoController, socketEngine.roomId);
            if (videoController.videoXPath) {
                let videoElement: HTMLVideoElement = document.evaluate(
                    videoController.videoXPath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue as HTMLVideoElement;
                if (videoElement) {
                    startPartyOnVideo(videoElement);
                }
            }
            break;
        case 'Q_GET_ROOM_ID':
            UtilsEngine.getTabId().then(function (tabId) {
                const message = {
                    code: 'A_GET_ROOM_ID',
                    tabId: tabId,
                    body: {
                        roomId: socketEngine.roomId,
                    },
                };
                chrome.runtime.sendMessage(message);
            });
            break;
        case 'Q_GET_VIDEO_XPATH':
            UtilsEngine.getTabId().then(function (tabId) {
                const message = {
                    code: 'A_GET_VIDEO_XPATH',
                    tabId: tabId,
                    body: {
                        videoXPath: videoController.videoXPath,
                    },
                };
                chrome.runtime.sendMessage(message);
            });
            break;
        case 'Q_GET_PAGE_STATUS':
            UtilsEngine.getTabId().then(function (tabId) {
                const message = {
                    code: 'A_GET_PAGE_STATUS',
                    tabId: tabId,
                    body: {
                        status: lucaEngine.getCurrentPageStatus(),
                    },
                };
                chrome.runtime.sendMessage(message);
            });
            break;
        case 'Q_INIT_PAGE_WITH_PARTY':
            let roomId = message.body.roomId;
            socketEngine.roomId = roomId;
            socketEngine.joinRoom(videoController, socketEngine.roomId);
            if (message.body.videoXPath) {
                videoController.videoXPath = message.body.videoXPath;
                let videoElement: HTMLVideoElement = document.evaluate(
                    message.body.videoXPath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue as HTMLVideoElement;
                if (videoElement) {
                    startPartyOnVideo(videoElement);
                }
            }
            break;
        case 'Q_GET_PARTY_USERS':
            UtilsEngine.getTabId().then(function (tabId) {
                const message = {
                    code: 'A_GET_PARTY_USERS',
                    tabId: tabId,
                    body: {
                        users: socketEngine.currentUsers,
                    },
                };
                chrome.runtime.sendMessage(message);
            });
            break;
    }
}
