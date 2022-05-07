import React, { Component } from 'react';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import PopUpEngine from '../../js/popup-engine';
class SelectVideoPage extends Component {
    selectVideohandle = () => {
        let popupEngine: PopUpEngine = new PopUpEngine();
        popupEngine.highlightPageVideos();
    };

    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="select__video">
                        <h1>Select a video to proceed</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit ipsam sed repudiandae.</p>

                        <GeneralButton name="Select video" click={this.selectVideohandle} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SelectVideoPage;
