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
           
        </div>

        <div class="luca-chat-input-container">
            <div class="luca-chat-send-message">
                <input id="luca-input-field" name="luca-input" placeholder="Write Something here" />
                <button id="luca-chat-send-message-button">
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
                <div class="luca-chat-emoji-reaction-container">

                </div> 
            </span> 
          
        </div>

        <div id="luca-chat-inner-toggle"></div>
        `

        let lucaChatToggle = document.createElement('div');
        lucaChatToggle.id = 'luca-chat-outer-toggle';
        lucaChatToggle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_125_2547)">
            <path d="M0.000488281 4.33097C0.000488281 3.3123 0.000488281 2.29352 0.000488281 1.2746C0.000488281 0.662774 0.385284 0.175359 0.97812 0.0314009C1.06987 0.00984485 1.16387 -0.000672901 1.25811 9.41706e-05C3.12604 9.41706e-05 4.99397 9.41706e-05 6.8619 9.41706e-05C7.02798 -0.00194753 7.1928 0.0292288 7.34667 0.0917986C7.50055 0.154368 7.64037 0.247066 7.75793 0.364448C7.87549 0.48183 7.96841 0.621541 8.03125 0.775351C8.09408 0.929161 8.12556 1.09397 8.12383 1.26012C8.12539 2.50384 8.12539 3.74732 8.12383 4.99053C8.12561 5.15667 8.09418 5.3215 8.0314 5.47533C7.96861 5.62916 7.87573 5.76887 7.75821 5.88629C7.64068 6.00371 7.50089 6.09646 7.34704 6.15907C7.19318 6.22169 7.02838 6.25292 6.86229 6.25093C5.37212 6.25093 3.88169 6.25093 2.39099 6.25093C2.33363 6.24896 2.27768 6.26898 2.23457 6.30688C1.69179 6.76275 1.14758 7.21718 0.601928 7.67018C0.502991 7.75233 0.403272 7.83213 0.263666 7.8114C0.107245 7.78832 0.000488281 7.65493 0.000488281 7.47537C0.000488281 6.96682 0.000488281 6.45826 0.000488281 5.95206V4.33097ZM0.626173 6.83145L0.711811 6.76221C1.11877 6.42318 1.52585 6.08415 1.93307 5.74512C2.0245 5.66654 2.14184 5.62472 2.26234 5.62776C3.77258 5.63011 5.28283 5.63011 6.79307 5.62776C7.24748 5.62776 7.50088 5.37583 7.50088 4.92361V1.32936C7.50088 0.881446 7.24708 0.625216 6.80207 0.625216H1.32381C0.878791 0.625216 0.62539 0.880664 0.62539 1.32936V6.83145H0.626173Z" fill="#E2E2E2"/>
            <path d="M9.37413 9.03653V8.92193C9.37413 7.22573 9.36983 5.52951 9.37726 3.8337C9.37726 3.42217 9.11173 3.13309 8.72733 3.12448C8.68654 3.12266 8.64653 3.11266 8.60968 3.09507C8.57283 3.07747 8.53989 3.05264 8.51283 3.02206C8.48576 2.99148 8.46511 2.95576 8.45211 2.91704C8.43912 2.87832 8.43404 2.83739 8.43717 2.79667C8.44188 2.71642 8.47729 2.64105 8.53604 2.58621C8.5948 2.53137 8.67239 2.50125 8.75275 2.50209C9.35067 2.4927 9.89853 2.9633 9.98222 3.55517C9.99335 3.63292 9.99897 3.71135 9.99903 3.78989C9.99903 5.73645 9.99903 7.68328 9.99903 9.63037C10.001 9.67251 9.99834 9.71473 9.99121 9.75632C9.9392 9.99103 9.68267 10.0791 9.47854 9.92532C9.31743 9.80445 9.16257 9.67496 9.00536 9.54899C8.698 9.30294 8.38985 9.05805 8.08444 8.81003C8.03777 8.77104 7.9782 8.75094 7.91746 8.7537C6.53756 8.75527 5.15754 8.75527 3.77738 8.7537C3.16069 8.7537 2.66914 8.36605 2.52875 7.76948C2.48026 7.56411 2.49355 7.35442 2.5045 7.14709C2.51272 6.98709 2.66953 6.86974 2.83221 6.87874C2.90896 6.88396 2.9811 6.91728 3.03484 6.97234C3.08858 7.0274 3.12016 7.10033 3.12354 7.17721C3.12706 7.26836 3.12354 7.35951 3.12354 7.45105C3.12354 7.86493 3.38672 8.12858 3.79889 8.12858C5.20825 8.12858 6.61747 8.12858 8.02656 8.12858C8.16341 8.1254 8.29663 8.17274 8.4008 8.26158C8.7023 8.50881 9.00888 8.75057 9.31351 8.99428C9.32955 9.00367 9.34519 9.01423 9.37413 9.03653Z" fill="#E2E2E2"/>
            <path d="M4.05257 2.50151C3.43418 2.50151 2.81593 2.50151 2.1978 2.50151C2.12215 2.50179 2.04896 2.47464 1.99178 2.42508C1.93461 2.37553 1.89732 2.30694 1.88682 2.23199C1.87632 2.15704 1.89332 2.08083 1.93468 2.01746C1.97604 1.9541 2.03896 1.90786 2.11177 1.88733C2.14652 1.87944 2.18213 1.87603 2.21775 1.87717H5.90811C6.11145 1.87717 6.25262 2.009 6.25028 2.19482C6.24793 2.38064 6.10715 2.50189 5.90772 2.50189C5.28959 2.50215 4.67121 2.50203 4.05257 2.50151Z" fill="#E2E2E2"/>
            <path d="M3.43738 3.12695H4.65746C4.8612 3.12695 5.00237 3.2584 5.00002 3.44382C4.99768 3.62925 4.85768 3.75167 4.65825 3.75167C3.84486 3.75167 3.03134 3.75167 2.21769 3.75167C2.01434 3.75167 1.87317 3.62025 1.87552 3.43482C1.87786 3.2494 2.01786 3.12695 2.2173 3.12695H3.43738Z" fill="#E2E2E2"/>
            </g>
            <defs>
            <clipPath id="clip0_125_2547">
            <rect width="10" height="10" fill="white"/>
            </clipPath>
            </defs>
        </svg>
        `
        document.body.appendChild(lucaChatToggle);
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

        ['like', 'love', 'sad', 'laugh', 'wow', 'angry'].forEach(function (reactionImage) {
            let imgReaction = document.createElement('img');
            imgReaction.classList.add('luca-reaction');
            imgReaction.src = chrome.runtime.getURL('assets/imgs/' + reactionImage + '.gif');
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

        let emojiReactionContainer: HTMLElement = document.getElementsByClassName('luca-chat-emoji-reaction-container')[0] as HTMLElement;
        ['like', 'love', 'sad', 'laugh', 'wow', 'angry'].forEach(function (reactionImage) {
            let imgReaction = document.createElement('img');
            imgReaction.classList.add('luca-reaction');
            imgReaction.src = chrome.runtime.getURL('assets/imgs/' + 'luca-' + reactionImage + '-reaction' + '.svg');
            imgReaction.dataset.reactionName = reactionImage;
            imgReaction.addEventListener('click', function (el) {
                el.preventDefault();
                _this.chatEngine.showReactionOnScreen((el.target as HTMLElement).dataset.reactionName);
                _this.chatEngine.sendReactionToRoom(
                    _this.socketEngine,
                    (el.target as HTMLElement).dataset.reactionName
                );
            });
            emojiReactionContainer.appendChild(imgReaction);
        });


        let lucaInput: HTMLInputElement = document.getElementById('luca-input-field') as HTMLInputElement;
        let lucaChatInnerToggle: HTMLElement = document.getElementById('luca-chat-inner-toggle') as HTMLElement;
        let lucaChatOuterToggle: HTMLElement = document.getElementById('luca-chat-outer-toggle') as HTMLElement;
        let lucaChatSendMessageButton: HTMLElement = document.getElementById('luca-chat-send-message-button') as HTMLElement;
        let lucaChatMessagesContainer: HTMLElement = document.getElementsByClassName('luca-chat-messages-container')[0] as HTMLElement;
        let lucaSendMessageAudioUrl = chrome.runtime.getURL('assets/audio/luca-message-send.mp3');
        let lucaSendMessageAudio = new Audio(lucaSendMessageAudioUrl);

        //Add Luca chat and reactions lisetners
        lucaInput.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                if (lucaInput.value) {
                    _this.chatEngine.sendMessageToRoom(_this.socketEngine, lucaInput.value);
                    _this.chatEngine.addMessageBubble(lucaInput.value);
                    lucaChatMessagesContainer.scrollTop = lucaChatMessagesContainer.scrollHeight;
                    lucaSendMessageAudio.play();
                    lucaInput.value = '';
                }
            }
        });
        lucaChatSendMessageButton.addEventListener('click', function (event) {
            if (lucaInput.value) {
                _this.chatEngine.sendMessageToRoom(_this.socketEngine, lucaInput.value);
                _this.chatEngine.addMessageBubble(lucaInput.value);
                lucaChatMessagesContainer.scrollTop = lucaChatMessagesContainer.scrollHeight;
                lucaInput.value = '';
            }
        });

        lucaChatInnerToggle.addEventListener('click', function (event) {
            divChatListFrame.classList.toggle('luca-chat--active-effect');
        });
        lucaChatOuterToggle.addEventListener('click', function (event) {
            divChatListFrame.classList.toggle('luca-chat--active-effect');
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