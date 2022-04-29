class ChatEngine {
    sendMessageToRoom(messageText: string) {
        socketEnging.sendPlayerOrder("message", {
            text: messageText,
        }, null)
    }

    addMessageBubble(messageText: string) {
        let divChatBubble = document.createElement("div");
        divChatBubble.classList.add("luca-chat-bubble");
        divChatBubble.innerText = messageText;

        let bubblesContainer = document.getElementById("luca-chat-container");
        if (bubblesContainer.firstChild) {
            bubblesContainer.insertBefore(divChatBubble, bubblesContainer.firstChild);
        } else {
            bubblesContainer.appendChild(divChatBubble);
        }
    }

    sendReactionToRoom(reactionName: string) {
        socketEnging.sendPlayerOrder("reaction", {
            name: reactionName,
        }, null);
    }
}