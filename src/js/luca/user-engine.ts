
export class UserEngine {
    //Names are generated thanks to https://blog.reedsy.com/character-name-generator/
    getCurrentUserName(cb: (name: string) => void) {
        chrome.storage.sync.get('userName', function (items) {
            let userName = items.userName;
            if (userName) {
                cb(userName);
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
            cb(userName);
        });
    }

    setCurrentUserName(newName: string) {
        chrome.storage.sync.set({ userName: newName }, function () { });
    }

    getCurrentUserAvatarCallBack: (avarat: string) => void = null;
    getCurrentUserAvatar(cb: (name: string) => void) {
        this.getCurrentUserAvatarCallBack = cb;
        let _this = this;
        chrome.storage.sync.get('userAvatar', function (items) {
            let userAvatar = items.userAvatar;
            if (!userAvatar) {
                userAvatar = '0.jpg';
                chrome.storage.sync.set({ userAvatar: userAvatar }, function () { });
            }
            _this.getCurrentUserAvatarCallBack(userAvatar);
        });
    }

    setCurrentUserAvatar(userAvatar: string) {
        chrome.storage.sync.set({ userAvatar: userAvatar }, function () { });
    }

}

export default UserEngine;