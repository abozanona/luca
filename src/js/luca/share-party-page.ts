import UtilsEngine from "./utils-engine";

class SharePartyPage {
    initLucaJoinParty() {
        const linkStyleLucaWebsite = document.createElement('link');
        linkStyleLucaWebsite.href = chrome.runtime.getURL('style/luca-website-style.css');
        linkStyleLucaWebsite.rel = 'stylesheet';
        linkStyleLucaWebsite.type = 'text/css';
        document.head.appendChild(linkStyleLucaWebsite);

        if (document.getElementById("luca-btn-join-party")) {
            document.getElementById("luca-btn-join-party").addEventListener('click', function () {
                const params = new URLSearchParams(window.location.search)
                if (params.has('roomId') && params.has('roomLink')) {
                    let roomId = params.get('roomId');
                    let roomLink = params.get('roomLink');
                    let videoXPath = params.get('videoXPath');
                    const message = {
                        code: 'Q_CREATE_PARTY_BY_INVITATION',
                        body: {
                            roomId: roomId,
                            roomLink: roomLink,
                            videoXPath: videoXPath,
                        },
                    };
                    chrome.runtime.sendMessage(message);
                }
                else {
                    alert(UtilsEngine.translate('ALERT_INVALID_PARTY_LINK'));
                }
            });
        };
    }
}

export default SharePartyPage;
