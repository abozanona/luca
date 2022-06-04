import { Settings } from '../../core/model/settings.model';

export class UserEngine {
    static async setSettings(settings: Settings): Promise<void> {
        await chrome.storage.sync.set({ lucaSettings: settings });
    }

    static async getSettings(): Promise<Settings> {
        let settings = await chrome.storage.sync.get('lucaSettings');
        if (!settings) {
            await this.setSettings(new Settings());
            return this.getSettings();
        }
        return <Settings>(settings.lucaSettings);
    }

}

export default UserEngine;
