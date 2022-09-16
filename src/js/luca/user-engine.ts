import { Settings } from '../luca/model/settings.model';
import { UserInterface } from './interfaces/user.interface';
import UtilsEngine from './utils-engine';

export class UserEngine {

    public static async getCurrentUser(): Promise<UserInterface> {
        let settings: Settings = await UserEngine.getSettings();
        let currentUser: UserInterface = { username: settings.username, userAvatar: settings.userAvatar, userId: settings.userId };
        return currentUser;
    }

    public static async setSettings(settings: Settings): Promise<void> {
        await UtilsEngine.browser.storage.sync.set({ lucaSettings: settings });
    }

    public static async getSettings(): Promise<Settings> {
        let settings = await UtilsEngine.browser.storage.sync.get('lucaSettings');
        if (!settings.lucaSettings) {
            await this.setSettings(new Settings());
            return this.getSettings();
        }
        return <Settings>(settings.lucaSettings);
    }

}

export default UserEngine;
