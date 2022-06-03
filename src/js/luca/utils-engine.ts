import UserEngine from './user-engine';

export class UtilsEngine {

    static refreshPage() {
        location.reload();
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    }

    static getTabId(): Promise<string> {
        return new Promise(function (resolve, reject) {
            chrome.runtime
                .sendMessage({ code: 'Q_TAB_ID' })
                .then((res) => {
                    resolve(res.body.tabId);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static getOffset(el: HTMLElement) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height,
        };
    }

    static getCurrentPageId(): Promise<string> {
        return new Promise(async function (resolve, reject) {
            let userEngine: UserEngine = new UserEngine();
            let userId: string = await (await userEngine.getSettings()).userId;
            let tabId: string = await UtilsEngine.getTabId();
            resolve(userId + '-in-' + tabId);
        });
    }

    static executeUnderDifferentTabId(messagePageId: string, cb: () => void) {
        UtilsEngine.getCurrentPageId().then(function (currentPageId) {
            if (messagePageId == currentPageId) {
                return;
            }
            cb();
        });
    }

    static getXPathTo(element: any): string {
        if (element === document.body) {
            return '//' + element.tagName.toLowerCase();
        }

        var ix = 0;
        var siblings = element.parentNode.childNodes;
        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];

            if (sibling === element) {
                return this.getXPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            }

            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
    }

    static translate(message: string, parameters: string[] = []) {
        return chrome.i18n.getMessage(message, parameters);
    }

    static async loadTemplate(templatePath: string) {
        const templateRes = await fetch(chrome.runtime.getURL(templatePath));
        let templateHTML = await templateRes.text();
        templateHTML = templateHTML.replace(/{__MSG_([a-zA-Z0-9_]+)__}/g, (m, o) => UtilsEngine.translate(o));
        return templateHTML;
    }

    static randomNames = (): string => {
        let lucaRandomNames = [
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
            'Kendry the mentor',
        ];

        return lucaRandomNames[Math.floor(Math.random() * lucaRandomNames.length)];
    };
    static isEmptyObject = (obj: any) => {
        return JSON.stringify(obj) === '{}';
    };
    static uuid = () => {
        return ('' + 1e8).replace(/[018]/g, (c) =>
            (parseInt(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (parseInt(c) / 4)))).toString(16)
        );
    };

}

export default UtilsEngine;
