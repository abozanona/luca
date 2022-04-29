class SocketEnging {
    static isSocketStarted = false;
    socket: any = null;
    roomId: string = null;

    constructor(private chatEngine: ChatEngine) { }

    initSocket(): void {
        if (SocketEnging.isSocketStarted) {
            alert("Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.")
            return;
        }
        SocketEnging.isSocketStarted = true;
        let _this = this;

        _this.socket = (<any>window).io('https://abozanona-luca.herokuapp.com/', {
            transports: ["websocket"],
            withCredentials: false,
            path: '/socket.io'
        });

        _this.socket.on("play", function (message: any) {
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoEngine.seek(message.time);
                videoEngine.play();
            })
        });

        _this.socket.on("pause", function (message: any) {
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoEngine.seek(message.time);
                videoEngine.pause();
            });
        });

        _this.socket.on("seek", function (message: any) {
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoEngine.seek(message.time);
            });
        });

        _this.socket.on("message", function (message: any) {
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                _this.chatEngine.addMessageBubble(message.text);
            });
        });

        _this.socket.on("reaction", function (message: any) {
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                lucaEngine.showReactionOnScreen(message.name);
            });
        });
    }

    createRoom() {
        _this.socket.emit("join", SocketEnging.roomId);
    }

    joinRoom() {
        _this.socket.emit("join", SocketEnging.roomId);
    }

    sendPlayerOrder(order: string, data: any, cb: () => void) {
        UtilsEngine.getCurrentPageId(function (pageId: string) {
            data.pageId = pageId;
            _this.socket.emit(order, data);
            if (cb) {
                cb();
            }
        });
    }

}