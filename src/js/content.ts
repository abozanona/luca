import { ChatEngine } from './luca/chat-engine';
import { LucaEngine } from './luca/luca-engine';
import { SocketEngine } from './luca/socket-engine';
import { UtilsEngine } from './luca/utils-engine';
import { VideoEngine } from './luca/video-engine';

let chatEngine = new ChatEngine();
let socketEngine = new SocketEngine(chatEngine);
let videoEngine = new VideoEngine(socketEngine);
let lucaEngine = new LucaEngine(chatEngine, socketEngine, videoEngine);

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message: any, sender: any, sendResponse: any) {
    switch (message.code) {
        case 'Q_HIGHLIGHT_ALL_VIDEOS':
            if (videoEngine.isVideoSelected) {
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
                    videoEngine.startStreamingOnVideo(elVideo);
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
            socketEngine.createRoom(videoEngine, UtilsEngine.uuidv4());
            break;
        case 'Q_JOIN_ROOM_ID':
            socketEngine.roomId = message.roomId;
            socketEngine.joinRoom(videoEngine, UtilsEngine.uuidv4());
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
    }
}

if (document.getElementById('luca-no-extension-found') && document.getElementById('luca-extension-found')) {
    document.getElementById('luca-no-extension-found').style.display = 'none';
    document.getElementById('luca-extension-found').style.display = 'block';
}
