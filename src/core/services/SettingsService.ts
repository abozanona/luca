import { Subject } from 'rxjs';
import { Settings } from '../model/settings.model';

const $settings = new Subject();
const themes = ['dark-theme', 'light-theme'];

export const SettingsService = {
    getSettingsChange: () => $settings.asObservable(),

    setSettingsChange: (settings: Settings) => $settings.next(settings),

    setTheme(settings: Settings): void {
        for (let i = 0; i < themes.length; i++) {
            document.documentElement.classList.remove(themes[i]);
        }
        document.documentElement.classList.add(settings.darkTheme ? 'dark-theme' : 'light-theme');
    },
};
