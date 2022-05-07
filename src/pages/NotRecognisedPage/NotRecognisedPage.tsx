import React, { Component } from 'react';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import UtilsEngine from '../../js/luca/utils-engine';
const Reload = require('../../assets/imgs/reload.svg')
const UnsupportedPage = require('../../assets/imgs/page-not-supported.svg');
class NotRecognisedPage extends Component {
    refreshPage = () => {
        UtilsEngine.refreshPage();
    };
    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="page__content d-flex-col d-aic d-jcc">
                        <img src={UnsupportedPage} alt="" />
                        <h1>This Page Not Supported</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit ipsam sed repudiandae.</p>
                        <GeneralButton name="Try Again" icon={Reload} click={this.refreshPage} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default NotRecognisedPage;
