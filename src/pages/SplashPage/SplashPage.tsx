import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            }
        });
    });

    return (
        <React.Fragment>
            <div className="page__container">
                <div className="page__content">
                    <img src={LucaLogo} alt="Luca Logo" />
                    <h1>Luca</h1>
                    <p>Watch movies with friends!</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SplashPage;
