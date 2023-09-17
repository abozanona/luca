import { UserInterface } from './interfaces/user.interface';
import { LucaEngine } from './luca-engine';
import { SocketEngine } from './socket-engine';
import UserEngine from './user-engine';
import UtilsEngine from './utils-engine';

export class ChatEngine {
    private reactionScreenAnimation(elem: any, bounds: any, delay: any) {
        let bottom = 0;
        let opacity = 1;
        let startRight = false;
        function frame() {
            bottom = bottom + delay;
            opacity = opacity - 0.005;
            elem.style.right = bounds + 'px';
            elem.style.bottom = bottom + 'px';
            elem.style.opacity = opacity;

            if (bottom > 2000) {
                elem.remove();
                clearInterval(id);
            }
        }
        let id = setInterval(frame, delay);
    }

    public sendMessageToRoom(socketEngine: SocketEngine, messageText: string) {
        socketEngine.sendSocketOrder('message', {
            text: messageText,
        });

        UserEngine.getCurrentUser().then((user: UserInterface) => {
            this.addMessageBubble(messageText, user);
        });
    }

    public async addMessageBubble(messageText: string, user: UserInterface) {
        const chatTemplateHTML = await UtilsEngine.loadTemplate("/templates/chat-bubble.template.html");
        let divChatBubble = document.createElement('div');
        divChatBubble.classList.add('luca-message-container');
        divChatBubble.innerHTML = chatTemplateHTML
            .replace('{userName}', user.username)
            .replace('{messageTime}', new Date().toLocaleTimeString())
            .replace('{messageText}', messageText)
            .replace('{userAvatar}', UtilsEngine.browser.runtime.getURL('assets/imgs/avatars/' + user.userAvatar));

        let bubblesContainer = document.getElementsByClassName('luca-chat-messages-container')[0] as HTMLElement;
        bubblesContainer.appendChild(divChatBubble);
        bubblesContainer.scrollTop = bubblesContainer.scrollHeight;

        UtilsEngine.playAudio('assets/audio/luca-message-send.mp3');

        let divChatListFrame: HTMLElement = document.getElementById('luca-chat-page-container');
        if (!divChatListFrame.classList.contains('luca-chat--active-effect')) {
            await this.addFloatingMessageBubble(messageText, user);
        }
    }

    public async addFloatingMessageBubble(messageText: string, user: UserInterface) {
        const floatingChatTemplateHTML = await UtilsEngine.loadTemplate("/templates/floating-chat-bubble.template.html");
        let divFloatingChatBubble = document.createElement('div');
        divFloatingChatBubble.classList.add('luca-floating-message-container');
        divFloatingChatBubble.innerHTML = floatingChatTemplateHTML
            .replace('{userName}', user.username)
            .replace('{messageText}', messageText)
            .replace('{userAvatar}', UtilsEngine.browser.runtime.getURL('assets/imgs/avatars/' + user.userAvatar));
        divFloatingChatBubble.addEventListener('click', (el) => {
            divFloatingChatBubble.remove();
        });
        setTimeout(() => {
            if (divFloatingChatBubble) {
                divFloatingChatBubble.remove();
            }
        }, 5000);

        let bubblesContainer = document.getElementById('luca-floating-chat-page-container') as HTMLElement;
        bubblesContainer.appendChild(divFloatingChatBubble);
        bubblesContainer.scrollTop = bubblesContainer.scrollHeight;
    }

    public async addActionBubble(actionText: string, user: UserInterface) {
        if (!user) {
            return;
        }
        let showActionsInChat: boolean = (await UserEngine.getSettings()).showActionsInChat;
        if (!showActionsInChat) {
            return;
        }
        const chatTemplateHTML = await UtilsEngine.loadTemplate("/templates/chat-action.template.html");
        let divChatBubble = document.createElement('div');
        divChatBubble.classList.add('luca-message-container');
        divChatBubble.innerHTML = chatTemplateHTML
            .replace('{userName}', user.username)
            .replace('{messageTime}', new Date().toLocaleTimeString())
            .replace('{messageText}', actionText)
            .replace('{userAvatar}', UtilsEngine.browser.runtime.getURL('assets/imgs/avatars/' + user.userAvatar));

        let bubblesContainer = document.getElementsByClassName('luca-chat-messages-container')[0] as HTMLElement;
        bubblesContainer.appendChild(divChatBubble);
        bubblesContainer.scrollTop = bubblesContainer.scrollHeight;
    }

    public sendReactionToRoom(socketEngine: SocketEngine, reactionName: string) {
        socketEngine.sendSocketOrder('reaction', {
            name: reactionName,
        });
    }

    private getRandomInteger = function (min: number, max: number): number {
        return Math.ceil(Math.random() * (max - min + 1)) + min;
    };

    private getRandomIntegerRanged = function (min: number, max: number): number {
        return Math.ceil(Math.random() * (max - min + 1)) + min * (Math.round(Math.random()) ? 1 : -1);
    };

    public showReactionOnScreen(reactionName: string) {
        let _this = this;
        var startScreenPercentage = 0.03;
        var endScreenPercentage = 0.97;

        var interval: any;

        interval = setInterval(function () {
            let imgReactionParticle = document.createElement('img');
            imgReactionParticle.classList.add('luca-reaction-particle');
            imgReactionParticle.src = UtilsEngine.browser.runtime.getURL('assets/imgs/reactions/' + reactionName + '.gif');
            imgReactionParticle.dataset.reactionName = reactionName;

            LucaEngine.fullScreenElement.appendChild(imgReactionParticle);
            let bounds: number = _this.getRandomIntegerRanged(
                LucaEngine.fullScreenElement.clientWidth * startScreenPercentage,
                LucaEngine.fullScreenElement.clientWidth * endScreenPercentage
            );

            _this.reactionScreenAnimation(imgReactionParticle, bounds, _this.getRandomInteger(10, 100));
            clearInterval(interval);
        }, 1);
    }
}

export default ChatEngine;
