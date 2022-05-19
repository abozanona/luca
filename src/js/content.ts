import { ChatEngine } from './luca/chat-engine';
import { LucaEngine } from './luca/luca-engine';
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

chrome.runtime.onMessage.addListener(gotMessage);

function initLucaJoinParty() {
    const linkStyleLucaWebsite = document.createElement('link');
    linkStyleLucaWebsite.href = chrome.runtime.getURL('style/luca-website-style.css');
    linkStyleLucaWebsite.rel = 'stylesheet';
    linkStyleLucaWebsite.type = 'text/css';
    document.head.appendChild(linkStyleLucaWebsite);

    if (document.getElementById("luca-btn-join-party")) {
        document.getElementById("luca-btn-join-party").addEventListener('click', function () {
            const params = new URLSearchParams(window.location.search)
            if (params.has('roomId') && params.has('roomLink')) {
                let roomId = params.get('roomId');
                let roomLink = params.get('roomLink');
                const message = {
                    code: 'Q_CREATE_PARTY_BY_INVITATION',
                    body: {
                        roomId: roomId,
                        roomLink: roomLink,
                    },
                };
                chrome.runtime.sendMessage(message);
            }
            else {
                alert("Invalid party link");
            }
        });
    };
}

initLucaJoinParty();

function gotMessage(message: any, sender: any, sendResponse: any) {
    switch (message.code) {
        case 'Q_HIGHLIGHT_ALL_VIDEOS':
            if (videoController.isVideoSelected) {
                alert(
                    'Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.'
                );
                return;
            }
            lucaEngine.initLuca();
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
                    lucaEngine.injectChat();
                    if (document.location.origin.includes('netflix.com')) {
                        ;
                    } else {
                        (videoController as GeneralVideoController).setVideo(elVideo);
                    }
                    videoController.startStreamingOnVideo();
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
            break;
        case 'Q_GET_ROOM_ID':
            UtilsEngine.getTabId(function (tabId) {
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
        case 'Q_GET_PAGE_STATUS':
            UtilsEngine.getTabId(function (tabId) {
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
            break;
    }
}

if (document.getElementById('luca-no-extension-found') && document.getElementById('luca-extension-found')) {
    document.getElementById('luca-no-extension-found').style.display = 'none';
    document.getElementById('luca-extension-found').style.display = 'block';
}
