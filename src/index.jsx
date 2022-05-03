import React from 'react';
import { render } from 'react-dom';
import './style/index.scss';
import Navbar from './components/Navbar';
import Avatar from './components/Avatar';
import Footer from './components/Footer';
import Modal from './components/Modal';
import ModalService from './core/services/ModalService';
import GeneralButton from './components/GeneralButton/GeneralButton';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
const google = require('./assets/imgs/google.svg');

export default class Popup extends React.Component {
    handleClick() {
        console.log('this is:', this);
    }
    render() {
        return (
            <div className="container">
                <Navbar />
                <div className="inner__container">
                    <DashboardPage />
                </div>
                <Footer />
                {/* <LoginPage /> */}
            </div>
            // <div className="container">
            //     <div className="luca__container">
            //         <Navbar />
            //         {/* <button onClick={() => ModalService.openModal('modal-id')}>Click me! </button> */}
            //         <GeneralButton class="btn--primary" name="Login" icon={google} click={() => this.handleClick()} />
            //         <Modal />
            //         <Footer />
            //     </div>

            //     {/* <Avatar /> */}
            //     <div className="modal--fade" onClick={() => ModalService.closeModal('modal-id')}></div>
            // </div>
        );
    }
}

render(<Popup />, document.getElementById('react-target'));
