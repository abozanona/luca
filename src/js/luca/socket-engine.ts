import { ChatEngine } from './chat-engine';
import { UserInterface } from './interfaces/user.interface';
import LucaEngine from './luca-engine';
import UserEngine from './user-engine';
import { UtilsEngine } from './utils-engine';
import { VideoControllerEngine } from './video-controller-engine';

export class SocketEngine {
    isSocketStarted = false;
    isSocketDisconnected = false;
    socket: any = null;
    roomId: string = null;

    currentUsers: UserInterface[] = [];

    constructor(private chatEngine: ChatEngine) { }

    private initSocket(videoControllerEngine: VideoControllerEngine, lucaEngine: LucaEngine): void {
        if (this.isSocketStarted) {
            alert(UtilsEngine.translate('ALERT_PARTY_ALREADY_RUNNING'));
            return;
        }
        this.isSocketStarted = true;
        let _this = this;

        this.socket = (<any>window).io(process.env.SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: false,
            path: '/socket.io',
            reconnectionDelay: 1000,
            reconnectionDelayMax: 50000,
            reconnectionAttempts: 50,
        });

        this.initSockeEvents();

        this.socket.on('join', function (message: any) {
            _this.addUserToChat(message.sender);
            _this.chatEngine.addActionBubble(UtilsEngine.translate('TEMPLATE_ACTION_USER_JOINED_PARTY'), message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
                videoControllerEngine.play();
            });
        });

        this.socket.on('play', function (message: any) {
            _this.addUserToChat(message.sender);
            _this.chatEngine.addActionBubble(UtilsEngine.translate('TEMPLATE_ACTION_USER_PLAYED_PARTY'), message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
                videoControllerEngine.play();
            });
        });

        this.socket.on('pause', function (message: any) {
            _this.addUserToChat(message.sender);
            _this.chatEngine.addActionBubble(UtilsEngine.translate('TEMPLATE_ACTION_USER_PAUSED_PARTY'), message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
                videoControllerEngine.pause();
            });
        });

        this.socket.on('seek', function (message: any) {
            let formatTime = function (sec_num: number) {
                sec_num = Math.floor(sec_num);
                let hours: any = Math.floor(sec_num / 3600);
                let minutes: any = Math.floor((sec_num - (hours * 3600)) / 60);
                let seconds: any = sec_num - (hours * 3600) - (minutes * 60);

                if (hours < 10) { hours = "0" + hours; }
                if (minutes < 10) { minutes = "0" + minutes; }
                if (seconds < 10) { seconds = "0" + seconds; }
                return hours + ':' + minutes + ':' + seconds;
            }
            _this.addUserToChat(message.sender);
            _this.chatEngine.addActionBubble(UtilsEngine.translate('TEMPLATE_ACTION_USER_SEEKED_PARTY', [formatTime(message.time).toString()]), message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
            });
        });

        this.socket.on('message', function (message: any) {
            _this.addUserToChat(message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                _this.chatEngine.addMessageBubble(message.text, message.sender);
            });
        });

        this.socket.on('reaction', function (message: any) {
            _this.addUserToChat(message.sender);
            _this.chatEngine.addActionBubble(UtilsEngine.translate('TEMPLATE_ACTION_USER_REACTED_ON_PARTY'), message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                _this.chatEngine.showReactionOnScreen(message.name);
            });
        });

        this.socket.on('videoToken', function (message: any) {
            lucaEngine.videoToken = message.videoToken;
        });
    }

    private initSockeEvents() {
        let _this = this;

        function connectSuccess() {
            let connectionStatus: HTMLElement = document.getElementById('luca-connection-status');
            let chatToggle: HTMLElement = document.getElementById('luca-chat-outer-toggle');
            if (!connectionStatus) {
                return;
            }
            connectionStatus.innerText = "";
            chatToggle.classList.remove('luca-chat-outer-toggle-disconnected');
            chatToggle.classList.remove('luca-chat-outer-toggle-reconnecting');
            if (_this.roomId) {
                _this.sendSocketOrder('rejoinRoom', {
                    roomId: _this.roomId,
                })
            }
        }
        function connectDisconnect() {
            let connectionStatus: HTMLElement = document.getElementById('luca-connection-status');
            let chatToggle: HTMLElement = document.getElementById('luca-chat-outer-toggle');
            if (!connectionStatus) {
                return;
            }
            connectionStatus.innerText = UtilsEngine.translate('TEMPLATE_CHAT_DISCONNECTED_FROM_SERVER');
            chatToggle.classList.add('luca-chat-outer-toggle-disconnected');
            chatToggle.classList.remove('luca-chat-outer-toggle-reconnecting');
        }
        function connectError() {
            let connectionStatus: HTMLElement = document.getElementById('luca-connection-status');
            let chatToggle: HTMLElement = document.getElementById('luca-chat-outer-toggle');
            if (!connectionStatus) {
                return;
            }
            connectionStatus.innerText = UtilsEngine.translate('TEMPLATE_CHAT_CANT_CONNECT_TO_SERVER');
            chatToggle.classList.add('luca-chat-outer-toggle-disconnected');
            chatToggle.classList.remove('luca-chat-outer-toggle-reconnecting');
        }
        function connectInProgress() {
            let connectionStatus: HTMLElement = document.getElementById('luca-connection-status');
            let chatToggle: HTMLElement = document.getElementById('luca-chat-outer-toggle');
            if (!connectionStatus) {
                return;
            }
            connectionStatus.innerText = UtilsEngine.translate('TEMPLATE_CHAT_RECONNECTING');
            chatToggle.classList.remove('luca-chat-outer-toggle-disconnected');
            chatToggle.classList.add('luca-chat-outer-toggle-reconnecting');
        }

        //Fired upon connection to the Namespace (including a successful reconnection).
        this.socket.on('connect', function () {
            if (_this.socket.disconnected) {

            } else {
                connectSuccess();
            }
        });
        //Fired upon a connection error
        this.socket.on('error', function (error: any) {
            connectError();
        });
        //Fired upon a successful reconnection
        this.socket.on('reconnect', function () {
            if (_this.socket.disconnected) {
                connectDisconnect();
            } else {
                connectSuccess();
            }
        });
        //Fired upon an attempt to reconnect
        this.socket.on('reconnect_attempt', function () {
            connectInProgress();
        });
        //Fired upon a reconnection attempt error
        this.socket.on('reconnect_error', function () {
            connectError();
        });
        //Fired when couldn't reconnect within reconnectionAttempts
        this.socket.on('reconnect_failed', function () {
            connectError();
        });
    }

    public disconnectSocket() {
        this.isSocketStarted = false;
        this.isSocketDisconnected = true;
        this.socket = null;
        this.roomId = null;
        this.currentUsers = [];
        this.socket.disconnect();
    }

    private addUserToChat(sender: UserInterface) {
        if (!sender) {
            return;
        }
        if (this.currentUsers.find((el) => el.userId == sender.userId)) {
            this.currentUsers = this.currentUsers.map((user) => {
                if (user.userId != sender.userId) {
                    return user;
                }
                return sender;
            });
        } else {
            this.currentUsers.push(sender);
        }
    }

    public createRoom(videoControllerEngine: VideoControllerEngine, lucaEngine: LucaEngine, roomId: string) {
        this.roomId = roomId;
        this.initSocket(videoControllerEngine, lucaEngine);
        this.sendSocketOrder('join', {
            roomId: this.roomId,
            visibility: 'private',
            pageUrl: videoControllerEngine.pageUrl,
            videoXPath: videoControllerEngine.videoXPath,
        });
    }

    public joinRoom(videoControllerEngine: VideoControllerEngine, lucaEngine: LucaEngine, roomId: string) {
        this.roomId = roomId;
        this.initSocket(videoControllerEngine, lucaEngine);
        this.sendSocketOrder('join', {
            roomId: this.roomId,
            visibility: 'private',
            pageUrl: videoControllerEngine.pageUrl,
            videoXPath: videoControllerEngine.videoXPath,
        });
        UserEngine.getCurrentUser().then((user: UserInterface) => {
            this.addUserToChat(user);
        });
    }

    public sendSocketOrder(order: string, data: any): Promise<void> {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            if (!_this.socket) {
                resolve();
                return;
            }
            let currentUser: UserInterface = await UserEngine.getCurrentUser();
            let currentPageId = await UtilsEngine.getCurrentPageId();
            data.pageId = currentPageId;
            data.sender = currentUser;
            _this.socket.emit(order, data);
            resolve();
        });
    }
}

export default SocketEngine;
