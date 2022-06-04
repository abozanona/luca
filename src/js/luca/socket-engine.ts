import { ChatEngine } from './chat-engine';
import { UserInterface } from './interfaces/user.interface';
import UserEngine from './user-engine';
import { UtilsEngine } from './utils-engine';
import { VideoControllerEngine } from './video-controller-engine';

export class SocketEngine {
    isSocketStarted = false;
    socket: any = null;
    roomId: string = null;

    currentUsers: UserInterface[] = [];

    constructor(private chatEngine: ChatEngine) {}

    initSocket(videoControllerEngine: VideoControllerEngine): void {
        if (this.isSocketStarted) {
            alert(UtilsEngine.translate('ALERT_PARTY_ALREADY_RUNNING'));
            return;
        }
        this.isSocketStarted = true;
        let _this = this;

        _this.socket = (<any>window).io('https://abozanona-luca.herokuapp.com/', {
            transports: ['websocket'],
            withCredentials: false,
            path: '/socket.io',
        });

        _this.socket.on('play', function (message: any) {
            _this.addUserToChat(message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
                videoControllerEngine.play();
            });
        });

        _this.socket.on('pause', function (message: any) {
            _this.addUserToChat(message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
                videoControllerEngine.pause();
            });
        });

        _this.socket.on('seek', function (message: any) {
            _this.addUserToChat(message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
            });
        });

        _this.socket.on('message', function (message: any) {
            _this.addUserToChat(message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                _this.chatEngine.addMessageBubble(message.text, message.sender);
            });
        });

        _this.socket.on('reaction', function (message: any) {
            _this.addUserToChat(message.sender);
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                _this.chatEngine.showReactionOnScreen(message.name);
            });
        });
    }

    addUserToChat(sender: UserInterface) {
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

    createRoom(videoControllerEngine: VideoControllerEngine, roomId: string) {
        this.roomId = roomId;
        this.initSocket(videoControllerEngine);
        this.socket.emit('join', this.roomId);
    }

    joinRoom(videoControllerEngine: VideoControllerEngine, roomId: string) {
        this.roomId = roomId;
        this.initSocket(videoControllerEngine);
        this.socket.emit('join', this.roomId);
    }

    sendPlayerOrder(order: string, data: any): Promise<void> {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            let userEngine: UserEngine = new UserEngine();
            let currentUser = (await userEngine.getSettings()).username;
            let currentPageId = await UtilsEngine.getCurrentPageId();
            data.pageId = currentPageId;
            data.pageId = currentPageId;
            data.sender = currentUser;
            _this.socket.emit(order, data);
            resolve();
        });
    }
}

export default SocketEngine;
