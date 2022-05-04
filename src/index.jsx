import React from 'react';
import { MemoryRouter as Router, Routes, Route, Switch } from 'react-router';
import { createRoot } from 'react-dom/client';
import './style/index.scss';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import SettingsPage from './pages/SettingsPage/SettingsPage';
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
                            <SettingsPage />
                            {/* <FriendsPage /> */}
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