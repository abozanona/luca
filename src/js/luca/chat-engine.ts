import { UserInterface } from './interfaces/user.interface';
import { LucaEngine } from './luca-engine';
import { SocketEngine } from './socket-engine';
import UserEngine from './user-engine';
import UtilsEngine from './utils-engine';

export class ChatEngine {
    reactionScreenAnimation(elem: any, bounds: any, delay: any) {
        let bottom = 0;
        let opacity = 1;
        let startRight = false;
        function frame() {
            bottom = bottom + delay;
            opacity = opacity - .005;
            elem.style.right = bounds + 'px';
            elem.style.bottom = bottom + 'px';
            elem.style.opacity = opacity;

            if (bottom > 2000) {
                elem.remove();
                clearInterval(id)
            }
        }
        let id = setInterval(frame, delay)
    }

    sendMessageToRoom(socketEngine: SocketEngine, messageText: string) {
        socketEngine.sendPlayerOrder(
            'message',
            {
                text: messageText,
            }
        );

        let userEngine: UserEngine = new UserEngine();
        userEngine.getCurrentUser().then(currentUser => {
            this.addMessageBubble(messageText, currentUser);
        });

    }

    async addMessageBubble(messageText: string, user: UserInterface) {

        const chatTemplateRes = await fetch(chrome.runtime.getURL("/templates/chat-bubble.template.html"));
        const chatTemplateHTML = await chatTemplateRes.text();

        let divChatBubble = document.createElement('div');
        divChatBubble.classList.add('luca-message-container');
        divChatBubble.innerHTML = chatTemplateHTML
            .replace("{userName}", user.userName)
            .replace("{messageTime}", new Date().toLocaleTimeString())
            .replace("{messageText}", messageText)
            .replace("{userAvatar}", chrome.runtime.getURL('assets/imgs/avatars/' + user.userAvatar))
            ;

        let bubblesContainer = document.getElementsByClassName('luca-chat-messages-container')[0];
        bubblesContainer.appendChild(divChatBubble);

        UtilsEngine.playAudio('assets/audio/luca-message-send.mp3');

        let lucaChatMessagesContainer: HTMLElement = document.getElementsByClassName('luca-chat-messages-container')[0] as HTMLElement;
        lucaChatMessagesContainer.scrollTop = lucaChatMessagesContainer.scrollHeight;

        let lucaInput: HTMLInputElement = document.getElementById('luca-input-field') as HTMLInputElement;
        lucaInput.value = '';
    }

    sendReactionToRoom(socketEngine: SocketEngine, reactionName: string) {
        socketEngine.sendPlayerOrder(
            'reaction',
            {
                name: reactionName,
            }
        );
    }

    getRandomInteger = function (min: number, max: number): number {
        return Math.ceil(Math.random() * (max - min + 1)) + min;
    };

    getRandomIntegerRanged = function (min: number, max: number): number {
        return Math.ceil(Math.random() * (max - min + 1)) + min * (Math.round(Math.random()) ? 1 : -1);
    }

    showReactionOnScreen(reactionName: string) {
        let _this = this;
        var startScreenPercentage = 0.03;
        var endScreenPercentage = 0.97;

        var interval: any;

        interval = setInterval(function () {
            let imgReactionParticle = document.createElement('img');
            imgReactionParticle.classList.add('luca-reaction-particle');
            imgReactionParticle.src = chrome.runtime.getURL('assets/imgs/' + reactionName + '.gif');
            imgReactionParticle.dataset.reactionName = reactionName;

            LucaEngine.fullScreenElement.appendChild(imgReactionParticle);
            let bounds: number = _this.getRandomIntegerRanged(
                LucaEngine.fullScreenElement.clientWidth * startScreenPercentage,
                LucaEngine.fullScreenElement.clientWidth * endScreenPercentage
            );

            _this.reactionScreenAnimation(imgReactionParticle, bounds, _this.getRandomInteger(10, 100))
            clearInterval(interval);
        }, 1);
    }

}

export default ChatEngine;