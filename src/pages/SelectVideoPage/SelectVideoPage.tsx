import React, { Component } from 'react';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
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
                        <h1>Select a video to start party</h1>
                        <p className="text-center">
                            Select the video you want to watch the party on.
                            <br />
                            If no video selection mark is showing, make sure that the video is already playing.
                        </p>
                        <GeneralButton name="Select Video" icon={Scan} click={this.selectVideohandle} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SelectVideoPage;
