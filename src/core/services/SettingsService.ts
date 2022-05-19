import { Subject } from 'rxjs';

const $avatar = new Subject();
const $username = new Subject();

export const SettingsService = {
    getAvatar: () => $avatar.asObservable(),
    getUserName: () => $username.asObservable(),

    setAvatar: (avatarImage: string) => $avatar.next(avatarImage),
    setUserName: (username: string) => $username.next(username),
};
