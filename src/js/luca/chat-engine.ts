import { LucaEngine } from './luca-engine';
import { SocketEnging } from './socket-engine';

export class ChatEngine {
    sendMessageToRoom(socketEnging: SocketEnging, messageText: string) {
        socketEnging.sendPlayerOrder(
            'message',
            {
                text: messageText,
            },
            null
        );
    }

    addMessageBubble(messageText: string) {
        let divChatBubble = document.createElement('div');
        divChatBubble.classList.add('luca-chat-bubble');
        divChatBubble.innerText = messageText;

        let bubblesContainer = document.getElementById('luca-chat-container');
        if (bubblesContainer.firstChild) {
            bubblesContainer.insertBefore(divChatBubble, bubblesContainer.firstChild);
        } else {
            bubblesContainer.appendChild(divChatBubble);
        }
    }

    sendReactionToRoom(socketEnging: SocketEnging, reactionName: string) {
        socketEnging.sendPlayerOrder(
            'reaction',
            {
                name: reactionName,
            },
            null
        );
    }

    getRandomInteger = function (min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    showReactionOnScreen(reactionName: string) {
        let _this = this;
        var randomSpeeds = function () {
            return _this.getRandomInteger(3000, 4000);
        }; // The lower, the faster
        var delay = 50; // The higher, the more delay
        var startScreenPercentage = 0.03;
        var endScreenPercentage = 0.97;

        var interval: any;

        interval = setInterval(function () {
            let imgReactionParticle = document.createElement('img');
            imgReactionParticle.classList.add('luca-reaction-particle');
            imgReactionParticle.src = chrome.runtime.getURL('img/reactions/' + reactionName + '.gif');
            imgReactionParticle.dataset.reactionName = reactionName;

            LucaEngine.fullScreenElement.appendChild(imgReactionParticle);
            let bounds: number = _this.getRandomInteger(
                LucaEngine.fullScreenElement.clientWidth * startScreenPercentage,
                LucaEngine.fullScreenElement.clientWidth * endScreenPercentage
            );
            (<any>window).$(imgReactionParticle).animate({ left: bounds, right: bounds }, delay, function () {
                (<any>window).$(imgReactionParticle).animate({ top: '-100%', opacity: 0 }, randomSpeeds(), function () {
                    (<any>window).$(imgReactionParticle).remove();
                });
            });
            clearInterval(interval);
        }, 1);
    }
}
