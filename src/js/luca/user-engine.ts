import { AppearanceSystem } from '../../core/model/appearance-system.model';
import { isEmptyObject } from '../../core/utils/utils';

export class UserEngine {
    //Just for testing
    clearGoogleSyncStorage() {
        chrome.storage.sync.clear();
    }

    async setSettings(settings: AppearanceSystem): Promise<void> {
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

    async getSettings(): Promise<AppearanceSystem> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync
                .get('lucaSettings')
                .then(async (items) => {
                    console.log(items);
                    if (isEmptyObject(items)) {
                        await this.setSettings(new AppearanceSystem()).then((res) => {
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
