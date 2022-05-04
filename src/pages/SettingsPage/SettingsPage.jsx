import React, { Component } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
const AddFriend = require('../../assets/imgs/add-friend.svg');
class SettingsPage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="settings__container ">
                        <div className="d-jcb d-aic">
                            {/* <h1 className="page__header">Settings</h1> */}
                        </div>
                        <div className="settings d-flex-col ">
                            <div className="setting d-flex d-aic d-jcb">
                                <div className="setting__info">
                                    <h1>Dark Theme</h1>
                                    <p>
                                        Put some information here. Put some information here.Put some information here.
                                    </p>
                                </div>
                                <div className="toggleWrapper">
                                    <input className="mobileToggle" type="checkbox" name="dark-theme" id="dark-theme" />
                                    <label htmlFor="dark-theme"></label>
                                </div>
                            </div>
                            <div className="setting d-flex d-aic d-jcb">
                                <div className="setting__info">
                                    <h1>Enable Shortcut</h1>
                                    <p>
                                        Put some information here. Put some information here.Put some information here.
                                    </p>
                                </div>
                                <div className="toggleWrapper">
                                    <input className="mobileToggle" type="checkbox" name="enable-shorcut" id="enable-shorcut"  />
                                    <label htmlFor="enable-shorcut"></label>
                                </div>
                            </div>
                            <div className="setting d-flex d-aic d-jcb">
                                <div className="setting__info">
                                    <h1>Show Extension Indecaters</h1>
                                    <p>
                                        Put some information here. Put some information here.Put some information here.
                                    </p>
                                </div>
                                <div className="toggleWrapper">
                                    <input className="mobileToggle" type="checkbox" name="indecaters" id="indecaters"  />
                                    <label htmlFor="indecaters"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SettingsPage;
