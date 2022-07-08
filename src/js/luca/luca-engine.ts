import { ChatEngine } from './chat-engine';
import { SocketEngine } from './socket-engine';
import UserEngine from './user-engine';
import UtilsEngine from './utils-engine';
import { VideoControllerEngine } from './video-controller-engine';

export class LucaEngine {

    static isLucaInitted = false;
    static fullScreenElement: HTMLElement = document.body;
    videoToken: string = null;

    constructor(
        private chatEngine: ChatEngine,
        private socketEngine: SocketEngine,
        private videoControllerEngine: VideoControllerEngine
    ) { }

    public initLuca() {
        if (LucaEngine.isLucaInitted) {
            return;
        }
        LucaEngine.isLucaInitted = true;
        UtilsEngine.injectStyle('style/page-style.css');
    }

    public async startVideoCall() {
        let userId: string = await (await UserEngine.getCurrentUser()).userId;
        let isInitialised: boolean = document.body.dataset['lucaVideoToken'] != null;
        document.body.dataset['lucaVideoAppId'] = process.env.AGORA_APP_ID;
        document.body.dataset['lucaVideoChannel'] = this.socketEngine.roomId;
        document.body.dataset['lucaVideoToken'] = this.videoToken;
        document.body.dataset['lucaVideoUID'] = userId;
        if (!isInitialised) {
            UtilsEngine.injectScript('/js/agora-rtc-n.js').then(() => UtilsEngine.injectScript('/js/video-call.js'));
        }
    }

    public async injectChat() {
        let _this = this;
        //Add Luca chat container and bubbles

        const chatTemplateHTML = await UtilsEngine.loadTemplate("/templates/chat.template.html");
        const chatToggleTemplateHTML = await UtilsEngine.loadTemplate("/templates/chat-toggle.template.html");

        let divChatListFrame = document.createElement('div');
        divChatListFrame.id = 'luca-chat-page-container';
        divChatListFrame.innerHTML = chatTemplateHTML
            .replace('{emojiIcon}', UtilsEngine.browser.runtime.getURL('assets/imgs/reaction_emoji.svg'))
            .replace('{arrowUp}', UtilsEngine.browser.runtime.getURL('assets/imgs/arrow_up.svg'))
            .replace('{exitIcon}', UtilsEngine.browser.runtime.getURL('assets/imgs/exit.svg'));
        document.body.appendChild(divChatListFrame);
        // luca-chat-exit-icon
        let lucaChatToggle = document.createElement('div');
        lucaChatToggle.id = 'luca-chat-outer-toggle';
        lucaChatToggle.innerHTML = chatToggleTemplateHTML;
        document.body.appendChild(lucaChatToggle);

        let lucaInput: HTMLInputElement = document.getElementById('luca-input-field') as HTMLInputElement;
        let lucaChatInnerToggle: HTMLElement = document.getElementById('luca-chat-inner-toggle') as HTMLElement;
        let lucaChatOuterToggle: HTMLElement = document.getElementById('luca-chat-outer-toggle') as HTMLElement;
        let lucaChatExitIcon: HTMLElement = document.getElementById('luca-chat-exit-icon') as HTMLElement;
        let lucaChatSendMessageButton: HTMLElement = document.getElementById(
            'luca-chat-send-message-button'
        ) as HTMLElement;

        window.addEventListener('keydown', function (e) {
            if (e.altKey == true && e.keyCode == 90 /*Z*/) {
                e.preventDefault();
                _this.toggleChatContainer();
            }
        });

        //Add Luca reactions container
        let divReactionsFrame = document.createElement('div');
        divReactionsFrame.id = 'luca-reactions-container';
        document.body.appendChild(divReactionsFrame);

        ['like', 'love', 'sad', 'laugh', 'wow', 'angry'].forEach(function (reactionImage) {
            let imgReaction = document.createElement('img');
            imgReaction.classList.add('luca-reaction');
            imgReaction.src = UtilsEngine.browser.runtime.getURL('assets/imgs/' + reactionImage + '.gif');
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

        let emojiReactionContainer: HTMLElement = document.getElementsByClassName(
            'luca-chat-emoji-reaction-container'
        )[0] as HTMLElement;
        ['like', 'love', 'sad', 'laugh', 'wow', 'angry'].forEach(function (reactionImage) {
            let imgReaction = document.createElement('img');
            imgReaction.classList.add('luca-reaction');
            imgReaction.src = UtilsEngine.browser.runtime.getURL('assets/imgs/' + 'luca-' + reactionImage + '-reaction' + '.svg');
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

        //Add Luca chat and reactions lisetners
        lucaInput.addEventListener('keyup', function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                if (lucaInput.value) {
                    _this.chatEngine.sendMessageToRoom(_this.socketEngine, lucaInput.value);
                    lucaInput.value = '';
                }
            }
        });
        lucaChatSendMessageButton.addEventListener('click', function (event) {
            event.preventDefault();
            if (lucaInput.value) {
                _this.chatEngine.sendMessageToRoom(_this.socketEngine, lucaInput.value);
                lucaInput.value = '';
            }
        });

        UtilsEngine.injectStyle('style/video-call-style.css');
        UtilsEngine.injectScript('/js/content-inject.js');

        lucaChatInnerToggle.addEventListener('click', function (event) {
            event.preventDefault();
            _this.toggleChatContainer();
        });
        lucaChatExitIcon.addEventListener('click', function (event) {
            event.preventDefault();
            divChatListFrame.classList.toggle('luca-chat--active-effect');
        });
        lucaChatOuterToggle.addEventListener('click', function (event) {
            event.preventDefault();
            _this.toggleChatContainer();
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
                        LucaEngine.fullScreenElement.appendChild(divReactionsFrame);
                        LucaEngine.fullScreenElement.appendChild(divChatListFrame);
                        LucaEngine.fullScreenElement.appendChild(lucaChatToggle);
                    });
                }
            );
        });

        await this.startVideoCall();
    }

    public getCurrentPageStatus() {
        if (!this.socketEngine.isSocketStarted) {
            return 'WAITING_CREATE_ROOM';
        }
        if (!this.videoControllerEngine.isVideoSelected) {
            return 'WAITING_SELECT_VIDEO';
        }
        return 'ROOM_SETUP_COMPLETED';
    }

    private toggleChatContainer() {
        let divChatListFrame: HTMLElement = document.getElementById('luca-chat-page-container');
        let lucaInput: HTMLInputElement = document.getElementById('luca-input-field') as HTMLInputElement;
        let bubblesContainer = document.getElementsByClassName('luca-chat-messages-container')[0] as HTMLElement;

        if (divChatListFrame.classList.contains('luca-chat--active-effect')) {
            divChatListFrame.classList.remove('luca-chat--active-effect');
        } else {
            divChatListFrame.classList.add('luca-chat--active-effect');
            lucaInput.focus();
            bubblesContainer.scrollTop = bubblesContainer.scrollHeight;
        }
    }
}

export default LucaEngine;
