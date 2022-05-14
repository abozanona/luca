import React, { ChangeEvent, Component } from 'react';
import PopUpEngine from '../../js/popup-engine';
const AddFriend = require('../../assets/imgs/add-friend.svg');
class SettingsPage extends Component<{}, { userName: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            userName: '',
        };

        let popupEngine: PopUpEngine = new PopUpEngine();
        popupEngine.getCurrentUserName((name) => {
            this.setState({ userName: name });
        });
    }

    handleOnChange = (e: ChangeEvent) => {
        let popupEngine: PopUpEngine = new PopUpEngine();
        let newName = (e.target as HTMLInputElement).value;
        this.setState({ userName: newName });
        popupEngine.setCurrentUserName(newName);
    };

    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="settings__container ">
                        <div className="d-jcb d-aic">{/* <h1 className="page__header">Settings</h1> */}</div>
                        <div className="settings d-flex-col ">
                            <div className="setting d-flex d-aic d-jcb">
                                <div className="setting__info">
                                    <h1>User Name</h1>
                                    <p>This the the name that will appear to other users in rooms</p>
                                </div>
                                <div className="toggleWrapper">
                                    <input
                                        onChange={this.handleOnChange}
                                        className=""
                                        type="text"
                                        name="user-name"
                                        id="user-name"
                                        value={this.state.userName}
                                    />
                                    <label htmlFor="user-name"></label>
                                </div>
                            </div>
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
                                    <input
                                        className="mobileToggle"
                                        type="checkbox"
                                        name="enable-shorcut"
                                        id="enable-shorcut"
                                    />
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
                                    <input className="mobileToggle" type="checkbox" name="indecaters" id="indecaters" />
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
