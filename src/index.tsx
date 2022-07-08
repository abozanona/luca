import React, { Component, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './style/index.scss';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import FriendsPage from './pages/FriendsPage/FriendsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import PartyPage from './pages/PartyPage/PartyPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SelectVideoPage from './pages/SelectVideoPage/SelectVideoPage';
import NotRecognisedPage from './pages/NotRecognisedPage/NotRecognisedPage';
import SplashPage from './pages/SplashPage/SplashPage';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserEngine } from './js/luca/user-engine';
import { SettingsService } from './core/services/SettingsService';
import PartyDisconnectedPage from './pages/PartyDisconnectedPage/PartyDisconnectedPage';

function PopupApp() {
    const navigate = useNavigate();

    useEffect(() => {
        UserEngine.getSettings().then((settings) => {
            SettingsService.setTheme(settings);
        });
    });

    return (
        <React.Fragment>
            <div className="container">
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                <Navbar />
                <div className="inner__container">
                    <Routes>
                        <Route path="/" element={<SplashPage />} />
                        <Route path="/dashboard" element={<DashboardPage navigate={navigate} />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/selectvideo" element={<SelectVideoPage />} />
                        <Route path="/notrecognised" element={<NotRecognisedPage />} />
                        <Route path="/partydisconnected" element={<PartyDisconnectedPage />} />
                        <Route path="/friends" element={<FriendsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/party" element={<PartyPage navigate={navigate} />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    );
}
const container = document.getElementById('react-target');
const root = createRoot(container);
root.render(
    <Router>
        <PopupApp />
    </Router>
);
