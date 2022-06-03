import { Settings } from '../../core/model/settings.model';
import UtilsEngine from './utils-engine';

export class UserEngine {
    async setSettings(settings: Settings): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync
                .set({ lucaSettings: settings })
                .then((items) => {
                    console.log('set', settings);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    async getSettings(): Promise<Settings> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync
                .get('lucaSettings')
                .then(async (items) => {
                    console.log(items);
                    if (UtilsEngine.isEmptyObject(items)) {
                        await this.setSettings(new Settings()).then((res) => {
                            this.getSettings();
                        });
                    }
                    resolve(items.lucaSettings);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default UserEngine;
