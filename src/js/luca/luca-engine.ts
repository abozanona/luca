class LucaEngine {
    static isLucaInitted = false;
    fullScreenElement: HTMLElement = document.body

    constructor(private chatEngine: ChatEngine) {}

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
            }
        });
    }

    injectStyle() {
        const linkStyle = document.createElement("link");
        linkStyle.href = chrome.runtime.getURL("css/page-style.css");
        linkStyle.rel = "stylesheet";
        linkStyle.type = "text/css";
        document.head.appendChild(linkStyle)
    }

    injectChat() {
        let _this = this;
        //Add Luca chat container abd bubbles
        let divChatListFrame = document.createElement("div");
        divChatListFrame.id = "luca-chat-container";
        document.body.appendChild(divChatListFrame);

        let divChatMessages = document.createElement("div");
        divChatMessages.id = "luca-chat-new-message";
        document.body.appendChild(divChatMessages);
        let inputChatMessages = document.createElement("input");
        inputChatMessages.placeholder = "Enter Message here";
        divChatMessages.appendChild(inputChatMessages);

        window.addEventListener('keydown', function (e) {
            if (e.altKey == true && e.keyCode == 90/*Z*/) {
                e.preventDefault();
                let messageDiv = document.getElementById("luca-chat-new-message");
                let allMessagesDiv = document.getElementById("luca-chat-container");
                let reactionsDiv = document.getElementById("luca-reactions-container");
                if (messageDiv.style.display === "none") {
                    messageDiv.style.display = "block";
                    inputChatMessages.focus();
                    allMessagesDiv.style.display = "block";
                    reactionsDiv.style.display = "block";
                } else {
                    messageDiv.style.display = "none";
                    allMessagesDiv.style.display = "none";
                    reactionsDiv.style.display = "none";
                }
            }
        });

        //Add Luca reactions container
        let divReactionsFrame = document.createElement("div");
        divReactionsFrame.id = "luca-reactions-container";
        document.body.appendChild(divReactionsFrame);

        ["like", "love", "sad", "haha", "wow", "angry"].forEach(function (reactionImage) {
            let imgReaction = document.createElement("img");
            imgReaction.classList.add("luca-reaction");
            imgReaction.src = chrome.runtime.getURL("img/reactions/" + reactionImage + ".gif");
            imgReaction.dataset.reactionName = reactionImage;
            imgReaction.addEventListener('click', function (el) {
                el.preventDefault();
                _this.showReactionOnScreen((el.target as HTMLElement).dataset.reactionName);
                _this.chatEngine.sendReactionToRoom((el.target as HTMLElement).dataset.reactionName);
            });
            divReactionsFrame.appendChild(imgReaction);
        });

        //Add Luca chat and reactions lisetners
        inputChatMessages.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                if (inputChatMessages.value) {
                    _this.chatEngine.sendMessageToRoom(inputChatMessages.value);
                    _this.chatEngine.addMessageBubble(inputChatMessages.value);
                    inputChatMessages.value = "";
                }
            }
        });

        //Show elements in full screne mode
        Array.from(document.querySelectorAll("*")).forEach((element) => {
            ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(ev => {
                element.addEventListener(ev, function () {
                    if (_this.fullScreenElement == null) {
                        _this.fullScreenElement = (element as HTMLElement);
                    }
                    else {
                        if (_this.fullScreenElement.contains(element)) {
                            _this.fullScreenElement = (element as HTMLElement);
                        }
                        else if (element.contains(_this.fullScreenElement)) {
                            ;
                        }
                        else {
                            _this.fullScreenElement = (element as HTMLElement);
                        }
                    }
                    let messageDiv = document.getElementById("luca-chat-new-message");
                    let allMessagesDiv = document.getElementById("luca-chat-container");
                    let reactionsDiv = document.getElementById("luca-reactions-container");
                    _this.fullScreenElement.appendChild(messageDiv);
                    _this.fullScreenElement.appendChild(allMessagesDiv);
                    _this.fullScreenElement.appendChild(reactionsDiv);
                });
            });
        })
    }

    getRandomInteger = function (min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    showReactionOnScreen(reactionName: string) {

        let _this = this;
        var randomSpeeds = function () { return _this.getRandomInteger(3000, 4000) } // The lower, the faster
        var delay = 50 // The higher, the more delay
        var startScreenPercentage = 0.03;
        var endScreenPercentage = 0.97;

        var interval: any;

        interval = setInterval(function () {

            let imgReactionParticle = document.createElement("img");
            imgReactionParticle.classList.add("luca-reaction-particle");
            imgReactionParticle.src = chrome.runtime.getURL("img/reactions/" + reactionName + ".gif");
            imgReactionParticle.dataset.reactionName = reactionName;


            _this.fullScreenElement.appendChild(imgReactionParticle);
            let bounds: number = _this.getRandomInteger(_this.fullScreenElement.clientWidth * startScreenPercentage, _this.fullScreenElement.clientWidth * endScreenPercentage);
            (<any>window).$(imgReactionParticle).animate({ left: bounds, right: bounds }, delay, function () {
                (<any>window).$(imgReactionParticle).animate({ top: '-100%', opacity: 0 }, randomSpeeds(), function () {
                    (<any>window).$(imgReactionParticle).remove()
                })
            })
            clearInterval(interval)
        }, 1)
    }
}