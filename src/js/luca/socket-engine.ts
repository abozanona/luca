import { ChatEngine } from './chat-engine';
import { UtilsEngine } from './utils-engine';
import { VideoControllerEngine } from './video-controller-engine';

export class SocketEngine {
    isSocketStarted = false;
    socket: any = null;
    roomId: string = null;

    constructor(private chatEngine: ChatEngine) {}

    initSocket(videoControllerEngine: VideoControllerEngine): void {
        if (this.isSocketStarted) {
            alert(
                'Cannot create or join a room here. A room is already running. Refresh the page or create a room in another page.'
            );
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
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
                videoControllerEngine.play();
            });
        });

        _this.socket.on('pause', function (message: any) {
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
                videoControllerEngine.pause();
            });
        });

        _this.socket.on('seek', function (message: any) {
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                videoControllerEngine.seek(message.time);
            });
        });

        _this.socket.on('message', function (message: any) {
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                _this.chatEngine.addMessageBubble(message.text);
            });
        });

        _this.socket.on('reaction', function (message: any) {
            UtilsEngine.executeUnderDifferentTabId(message.pageId, function () {
                _this.chatEngine.showReactionOnScreen(message.name);
            });
        });
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

    sendPlayerOrder(order: string, data: any, cb: () => void) {
        let _this = this;
        UtilsEngine.getCurrentPageId(function (pageId: string) {
            data.pageId = pageId;
            _this.socket.emit(order, data);
            if (cb) {
                cb();
            }
        });
    }
}

export default SocketEngine;