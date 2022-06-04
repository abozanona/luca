import React, { Component } from 'react';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import UtilsEngine from '../../js/luca/utils-engine';
import PopUpEngine from '../../js/popup-engine';
const Scan = require('../../assets/imgs/scan.svg');
const SelectVideo = require('../../assets/imgs/select-video-empty-state.svg');
class SelectVideoPage extends Component {
    selectVideohandle = () => {
        let popupEngine: PopUpEngine = new PopUpEngine();
        popupEngine.highlightPageVideos();
    };

    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="page__content d-flex-col d-aic d-jcc">
                        <img src={SelectVideo} alt="" />
                        <h1>{UtilsEngine.translate('SELECT_VIDEO_SELECT_VIDEO_To_START_PARTY')}</h1>
                        <p className="text-center">
                            {UtilsEngine.translate('SELECT_VIDEO_SELECT_VIDEO_To_START_PARTY_NOTICE_1')}
                            <br />
                            {UtilsEngine.translate('SELECT_VIDEO_SELECT_VIDEO_To_START_PARTY_NOTICE_2')}
                        </p>
                        <GeneralButton name="Select Video" icon={Scan} click={this.selectVideohandle} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SelectVideoPage;
