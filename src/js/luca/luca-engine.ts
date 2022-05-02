import { ChatEngine } from './chat-engine';
import { SocketEnging } from './socket-engine';
import { VideoEngine } from './video-engine';

export class LucaEngine {
    static isLucaInitted = false;
    static fullScreenElement: HTMLElement = document.body;

    constructor(private chatEngine: ChatEngine, private socketEnging: SocketEnging, private videoEngine: VideoEngine) {}

    initLuca() {
        if (LucaEngine.isLucaInitted) {
            return;
        }
        LucaEngine.isLucaInitted = true;

        this.addVideoProperty();

        this.injectStyle();

        this.injectChat();
    }

    addVideoProperty() {
        //Add playing property to videos
        Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
            get: function () {
                return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
            },
        });
    }

    injectStyle() {
        const linkStyle = document.createElement('link');
        linkStyle.href = chrome.runtime.getURL('css/page-style.css');
        linkStyle.rel = 'stylesheet';
        linkStyle.type = 'text/css';
        document.head.appendChild(linkStyle);
    }

    injectChat() {
        let _this = this;
        //Add Luca chat container and bubbles
        let divChatListFrame = document.createElement('div');
        divChatListFrame.id = 'luca-chat-container';
        document.body.appendChild(divChatListFrame);

        let divChatMessages = document.createElement('div');
        divChatMessages.id = 'luca-chat-new-message';
        document.body.appendChild(divChatMessages);
        let inputChatMessages = document.createElement('input');
        inputChatMessages.placeholder = 'Enter Message here';
        divChatMessages.appendChild(inputChatMessages);

        window.addEventListener('keydown', function (e) {
            if (e.altKey == true && e.keyCode == 90 /*Z*/) {
                e.preventDefault();
                let messageDiv = document.getElementById('luca-chat-new-message');
                let allMessagesDiv = document.getElementById('luca-chat-container');
                let reactionsDiv = document.getElementById('luca-reactions-container');
                if (messageDiv.style.display === 'none') {
                    messageDiv.style.display = 'block';
                    inputChatMessages.focus();
                    allMessagesDiv.style.display = 'block';
                    reactionsDiv.style.display = 'block';
                } else {
                    messageDiv.style.display = 'none';
                    allMessagesDiv.style.display = 'none';
                    reactionsDiv.style.display = 'none';
                }
            }
        });

        //Add Luca reactions container
        let divReactionsFrame = document.createElement('div');
        divReactionsFrame.id = 'luca-reactions-container';
        document.body.appendChild(divReactionsFrame);

        ['like', 'love', 'sad', 'haha', 'wow', 'angry'].forEach(function (reactionImage) {
            let imgReaction = document.createElement('img');
            imgReaction.classList.add('luca-reaction');
            imgReaction.src = chrome.runtime.getURL('img/reactions/' + reactionImage + '.gif');
            imgReaction.dataset.reactionName = reactionImage;
            imgReaction.addEventListener('click', function (el) {
                el.preventDefault();
                _this.chatEngine.showReactionOnScreen((el.target as HTMLElement).dataset.reactionName);
                _this.chatEngine.sendReactionToRoom(
                    _this.socketEnging,
                    (el.target as HTMLElement).dataset.reactionName
                );
            });
            divReactionsFrame.appendChild(imgReaction);
        });

        //Add Luca chat and reactions lisetners
        inputChatMessages.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                if (inputChatMessages.value) {
                    _this.chatEngine.sendMessageToRoom(_this.socketEnging, inputChatMessages.value);
                    _this.chatEngine.addMessageBubble(inputChatMessages.value);
                    inputChatMessages.value = '';
                }
            }
        });

        //Show elements in full screne mode
        Array.from(document.querySelectorAll('*')).forEach((element) => {
            ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(
                (ev) => {
                    element.addEventListener(ev, function () {
                        if (LucaEngine.fullScreenElement == null) {
                            LucaEngine.fullScreenElement = element as HTMLElement;
                        } else {
                            if (LucaEngine.fullScreenElement.contains(element)) {
                                LucaEngine.fullScreenElement = element as HTMLElement;
                            } else if (element.contains(LucaEngine.fullScreenElement)) {
                            } else {
                                LucaEngine.fullScreenElement = element as HTMLElement;
                            }
                        }
                        let messageDiv = document.getElementById('luca-chat-new-message');
                        let allMessagesDiv = document.getElementById('luca-chat-container');
                        let reactionsDiv = document.getElementById('luca-reactions-container');
                        LucaEngine.fullScreenElement.appendChild(messageDiv);
                        LucaEngine.fullScreenElement.appendChild(allMessagesDiv);
                        LucaEngine.fullScreenElement.appendChild(reactionsDiv);
                    });
                }
            );
        });
    }

    getCurrentPageStatus() {
        if (!this.socketEnging.isSocketStarted) {
            return 'WAITING_CREATE_ROOM';
        }
        if (!this.videoEngine.isVideoSelected) {
            return 'WAITING_SELECT_VIDEO';
        }
        return 'ROOM_SETUP_COMPLETED';
    }
}
