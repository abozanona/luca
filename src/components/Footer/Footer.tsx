import React, { Component } from 'react';
import UtilsEngine from '../../js/luca/utils-engine';

class Footer extends Component {
    render() {
        return (
            <div className="footer__containter">
                <p>
                    {UtilsEngine.translate('FOOTER_POWERED_BY')} <a href="https://cotede.co/" target="_blank">{UtilsEngine.translate('FOOTER_COTEDE')}</a>
                </p>
            </div>
        );
    }
}

export default Footer;
