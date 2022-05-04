import React, { Component } from 'react';
import Footer from '../../components/Footer';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
const LucaLogo = require('../../assets/imgs/luca-logo.svg');
const google = require('../../assets/imgs/google.svg');
class LoginPage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="login__container">
                    <div className="login__info">
                        <img src={LucaLogo} alt="Luca Logo" />
                        <h1>Luca</h1>
                        <p>Watch movies with friends!</p>
                    </div>
                    <div className="login__actions">
                        <GeneralButton class="btn--secondary" name="Continue as a guest" />
                        <GeneralButton name="Login/ Register" icon={google} />
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default LoginPage;
