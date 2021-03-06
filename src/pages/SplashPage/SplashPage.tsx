import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UtilsEngine from '../../js/luca/utils-engine';
import PopUpEngine from '../../js/popup-engine';
const LucaLogo = require('../../assets/imgs/luca-logo.svg');

function SplashPage() {
    const navigate = useNavigate();
    useEffect(() => {
        let popupEngine: PopUpEngine = new PopUpEngine();
        popupEngine.getCurrentPageStatus((currentPage: string) => {
            switch (currentPage) {
                case 'NOTHING':
                    navigate('/notrecognised', { replace: true });
                    break;
                case 'WAITING_CREATE_ROOM':
                    navigate('/dashboard', { replace: true });
                    break;
                case 'WAITING_SELECT_VIDEO':
                    navigate('/selectvideo', { replace: true });
                    break;
                case 'ROOM_SETUP_COMPLETED':
                    navigate('/party', { replace: true });
                    break;
                case 'PARTY_DISCONNECTED':
                    navigate('/partydisconnected', { replace: true });
                    break;
            }
        });
    });

    return (
        <React.Fragment>
            <div className="page__container">
                <div className="page__content dd-jcc d-aic d-flex-col">
                    <img src={LucaLogo} alt={UtilsEngine.translate('SPLASH_APP_NAME')} />
                    <h1>{UtilsEngine.translate('SPLASH_APP_NAME')}</h1>
                    <p>{UtilsEngine.translate('SPLASH_NOTICE')}</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SplashPage;
