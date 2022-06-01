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
                        <h1>{UtilsEngine.translate('NOT_RECOGNISED_PAGE_NOT_SUPPORTED')}</h1>
                        <p>{UtilsEngine.translate('NOT_RECOGNISED_PAGE_NOT_SUPPORTED_NOTICE')}</p>
                        <GeneralButton name={UtilsEngine.translate('NOT_RECOGNISED_TRY_AGAIN')} icon={Reload} click={this.refreshPage} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default NotRecognisedPage;
