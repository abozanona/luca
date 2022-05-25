import { UserInterface } from "./interfaces/user.interface";
import UtilsEngine from "./utils-engine";


export class UserEngine {


    //Names are generated thanks to https://blog.reedsy.com/character-name-generator/
    getCurrentUserName(): Promise<string> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get('userName').then(function (items) {
                let userName = items.userName;
                if (userName) {
                    resolve(userName);
                    return;
                }
                var randomNames = [
                    'Xandyr the elf',
                    'Raelle the elf',
                    'Pollo the elf',
                    'Wex the elf',
                    'Solina the elf',
                    'Balon the dragon',
                    'Kolloth the dragon',
                    'Tren the dragon',
                    'Axan the dragon',
                    'Naga the dragon',
                    'Shalana the champ',
                    'Leandra the champ',
                    'Finhad the champ',
                    'Giliel the champ',
                    'Amrond the champ',
                    'Dracul the villan',
                    'Kedron the villan',
                    'Edana the villan',
                    'Brenna the villan',
                    'Gorgon the villan',
                    'Kahraman the superhero',
                    'Lucinda the superhero',
                    'Manning the superhero',
                    'Gunnar the superhero',
                    'Botilda the superhero',
                    'Aanya the sidekick',
                    'Creda the sidekick',
                    'Ervin the sidekick',
                    'Leya the sidekick',
                    'Etel the sidekick',
                    'Konrad the mentor',
                    'Orela the mentor',
                    'Eldred the mentor',
                    'Zilya the mentor',
                    'Kendry the mentor'
                ];
                userName = randomNames[Math.floor(Math.random() * randomNames.length)];
                chrome.storage.sync.set({ userName: userName }, function () { });
                resolve(userName);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    setCurrentUserName(newName: string): Promise<void> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.set({ userName: newName }).then(function (items) {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    async getCurrentUserAvatar(): Promise<string> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get('userAvatar').then(function (items) {
                let userAvatar = items.userAvatar;
                if (!userAvatar) {
                    userAvatar = '0.svg';
                    chrome.storage.sync.set({ userAvatar: userAvatar }, function () { });
                }
                resolve(userAvatar);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    setCurrentUserAvatar(userAvatar: string): Promise<void> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.set({ userAvatar: userAvatar }).then(function (items) {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getUserId(): Promise<string> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get('userid').then(function (items) {
                var userId = items.userid;
                if (userId) {
                    resolve(userId);
                } else {
                    userId = UtilsEngine.uuid();
                    resolve(userId);
                    chrome.storage.sync.set({ userid: userId }, function () {
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getCurrentUser(): Promise<UserInterface> {
        return new Promise(async function (resolve, reject) {
            let userEngine: UserEngine = new UserEngine();
            let userId = await userEngine.getUserId();
            let userAvatar = await userEngine.getCurrentUserAvatar();
            let userName = await userEngine.getCurrentUserName();
            resolve({ userId: userId, userAvatar: userAvatar, userName: userName });
        });
    }

}

export default UserEngine;