import React from 'react';
import { MemoryRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './style/index.scss';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import FriendsPage from './pages/FriendsPage/FriendsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import PartyPage from './pages/PartyPage/PartyPage';
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
                            <Routes>
                                <Route path="/" element={<DashboardPage />} />
                                <Route path="/friends" element={<FriendsPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/party" element={<PartyPage />} />
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </Router>
            </React.Fragment>
        );
    }
}
const container = document.getElementById('react-target');
const root = createRoot(container);
root.render(<Popup tab="home" />);
