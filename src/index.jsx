import React from 'react';
import './style/index.scss';
import Navbar from './components/Navbar';
import Avatar from './components/Avatar';
import Footer from './components/Footer';
import Modal from './components/Modal';
import ModalService from './core/services/ModalService';
import GeneralButton from './components/GeneralButton/GeneralButton';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import PartyPage from './pages/PartyPage/PartyPage';
import { MemoryRouter as Router, Routes, Route, Switch } from 'react-router';
import { createRoot } from 'react-dom/client';
import FriendsPage from './pages/FriendsPage/FriendsPage';
const google = require('./assets/imgs/google.svg');
class Popup extends React.Component {
    handleClick() {
        console.log('this is:', this);
    }
    render() {
        return (
            <React.Fragment>
                <Router>
                    <div className="container">
                        <Navbar />
                        <div className="inner__container">
                            {/* <DashboardPage /> */}
                            {/* <PartyPage /> */}
                            <FriendsPage />
                            {/* <Routes>
                                <Route path="/" element={<DashboardPage />} />
                                <Route path="/home" element={<LoginPage />} />
                            </Routes> */}
                        </div>
                        <Footer />
                        {/* <LoginPage /> */}
                    </div>
                </Router>
            </React.Fragment>

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
const container = document.getElementById('react-target');
const root = createRoot(container);
root.render(<Popup tab="home" />);