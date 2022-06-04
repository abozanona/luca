import { Subject } from 'rxjs';
import { Settings } from '../model/settings.model';

const themes = ['dark-theme', 'light-theme'];

export class SettingsService {
    static $settings = new Subject();

    static getSettingsChange() {
        return this.$settings.asObservable();
    }

    static setSettingsChange(settings: Settings) {
        return this.$settings.next(settings);
    }

    static setTheme(settings: Settings): void {
        for (let i = 0; i < themes.length; i++) {
            document.documentElement.classList.remove(themes[i]);
        }
        document.documentElement.classList.add(settings.darkTheme ? 'dark-theme' : 'light-theme');
    }
};
