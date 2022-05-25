import { Subject } from 'rxjs';
import { AppearanceSystem } from '../model/appearance-system.model';

const $avatar = new Subject();
const $username = new Subject();
const themes = ['dark-theme', 'light-theme']

export const SettingsService = {

    getAvatar: () => $avatar.asObservable(),
    getUserName: () => $username.asObservable(),

    setAvatar: (avatarImage: string) => $avatar.next(avatarImage),
    setUserName: (username: string) => $username.next(username),

    getWebsiteSettings(): AppearanceSystem {
        let settings = localStorage.getItem('websiteSettings');
        if (settings) return JSON.parse(settings);
        return new AppearanceSystem();
    },

    setTheme(settings: AppearanceSystem): void {
        for (let i = 0; i < themes.length; i++) {
            document.documentElement.classList.remove(themes[i]);
        }
        document.documentElement.classList.add(settings.darkTheme ? 'dark-theme' : 'light-theme');
    }
};
