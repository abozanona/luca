import { ChatEngine } from './chat-engine';
import { SocketEngine } from './socket-engine';
import { VideoEngine } from './video-engine';

export class LucaEngine {
    static isLucaInitted = false;
    static fullScreenElement: HTMLElement = document.body;

    constructor(private chatEngine: ChatEngine, private socketEngine: SocketEngine, private videoEngine: VideoEngine) { }

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
        linkStyle.href = chrome.runtime.getURL('style/page-style.css');
        linkStyle.rel = 'stylesheet';
        linkStyle.type = 'text/css';
        document.head.appendChild(linkStyle);
    }

    injectChat() {
        let _this = this;
        //Add Luca chat container and bubbles
        let divChatListFrame = document.createElement('div');
        divChatListFrame.id = 'luca-chat-page-container';
        divChatListFrame.innerHTML =
            `
        <div class="luca-chat-header">
            <h1>Chat</h1>
        </div>
        <div class="luca-chat-messages-container"> 
            <div class="luca-message-container">
                <div class="luca-message-information">
                    <div class="luca-message-avatar">
                        <img src="https://i.pinimg.com/564x/70/ab/7b/70ab7b9eb95c0543e0d1ab4cd4b3152b.jpg">
                        <h1>Skafi ps </h1>
                     </div>
                    <p>2h ago</p>
                </div>
                <div class="luca-message">
                    <p>  Put some information here. Put some information  here.Put some information here. </p>
                </div>
            </div>
        </div>

        <div class="luca-chat-input-container">
            <div class="luca-chat-send-message">
                <input name="luca-input" placeholder="Write Something here" value="luca-input"/>
                <button>
                    <span>  
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.35355 0.646447C4.15829 0.451184 3.84171 0.451184 3.64645 0.646447L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.97631 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646447ZM4.5 12L4.5 1L3.5 1L3.5 12L4.5 12Z" fill="white"/>
                        </svg>
                    </span>
                </button>
            </div>
            <span class="luca-chat-emoji"> 
                <svg width="25" height="25" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.79545 8.11364C6.43556 8.11364 6.95455 7.42165 6.95455 6.56818C6.95455 5.71471 6.43556 5.02273 5.79545 5.02273C5.15535 5.02273 4.63636 5.71471 4.63636 6.56818C4.63636 7.42165 5.15535 8.11364 5.79545 8.11364Z" fill="#A4A4A4"/>
                    <path d="M12.3636 6.56818C12.3636 7.42165 11.8446 8.11364 11.2045 8.11364C10.5644 8.11364 10.0455 7.42165 10.0455 6.56818C10.0455 5.71471 10.5644 5.02273 11.2045 5.02273C11.8446 5.02273 12.3636 5.71471 12.3636 6.56818Z" fill="#A4A4A4"/>
                    <path d="M8.5 11.8143C9.65909 11.8143 10.8182 11.0016 10.8182 10.1481C10.8182 9.29461 9.27273 9.27273 8.5 9.27273C7.72727 9.27273 6.18182 9.29461 6.18182 10.1481C6.18182 11.0016 7.34091 11.8143 8.5 11.8143Z" fill="#A4A4A4"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17 8.5C17 13.1945 13.1945 17 8.5 17C3.80553 17 0 13.1945 0 8.5C0 3.80553 3.80553 0 8.5 0C13.1945 0 17 3.80553 17 8.5ZM15.4545 8.5C15.4545 12.3408 12.3408 15.4545 8.5 15.4545C4.65919 15.4545 1.54545 12.3408 1.54545 8.5C1.54545 4.65919 4.65919 1.54545 8.5 1.54545C12.3408 1.54545 15.4545 4.65919 15.4545 8.5Z" fill="#A4A4A4"/>
                </svg>
            </span>            
        </div>

        <div class="luca-chat-resizer"></div>
        `

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
                    _this.socketEngine,
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
                    _this.chatEngine.sendMessageToRoom(_this.socketEngine, inputChatMessages.value);
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
        if (!this.socketEngine.isSocketStarted) {
            return 'WAITING_CREATE_ROOM';
        }
        if (!this.videoEngine.isVideoSelected) {
            return 'WAITING_SELECT_VIDEO';
        }
        return 'ROOM_SETUP_COMPLETED';
    }
}

export default LucaEngine;