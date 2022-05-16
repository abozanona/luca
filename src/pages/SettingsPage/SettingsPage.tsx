import React, { ChangeEvent, Component } from 'react';
import UserEngine from '../../js/luca/user-engine';
const AddFriend = require('../../assets/imgs/add-friend.svg');
class SettingsPage extends Component<{}, { userName: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            userName: '',
        };

        let userEngine: UserEngine = new UserEngine();
        userEngine.getCurrentUserName((name) => {
            this.setState({ userName: name });
        });
    }

    handleOnChange = (e: ChangeEvent) => {
        let userEngine: UserEngine = new UserEngine();
        let newName = (e.target as HTMLInputElement).value;
        this.setState({ userName: newName });
        userEngine.setCurrentUserName(newName);
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
                                    <h1>User Avatar</h1>
                                    <p>Select your avatar</p>
                                </div>
                                <div className="avatars--container">
                                    {[
                                        '0.jpg',
                                        '1.jpg',
                                        '2.jpg',
                                        '3.jpg',
                                        '4.jpg',
                                        '5.jpg',
                                        '6.jpg',
                                        '7.jpg',
                                        '8.jpg',
                                    ].map((avatar, index) => {
                                        return (
                                            <img
                                                key={index}
                                                className="img-avatar"
                                                data-name={avatar}
                                                src={'/assets/imgs/avatars/' + avatar}
                                                onClick={this.changeAvatar}
                                            />
                                        );
                                    })}
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

    changeAvatar(el: React.MouseEvent<HTMLImageElement>) {
        let clickedImage: HTMLImageElement = el.target as HTMLImageElement;
        if (document.getElementsByClassName('img-avatar-selected')[0]) {
            document.getElementsByClassName('img-avatar-selected')[0].classList.remove('img-avatar-selected');
        }
        clickedImage.classList.add('img-avatar-selected');
        let avatarName = clickedImage.dataset.name;
        let userEngine: UserEngine = new UserEngine();
        userEngine.setCurrentUserName(avatarName);
    }
}

export default SettingsPage;
