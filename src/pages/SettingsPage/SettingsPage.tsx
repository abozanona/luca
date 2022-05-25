import React, { ChangeEvent, Component, useState } from 'react';
import UserEngine from '../../js/luca/user-engine';
import { toast } from 'react-toastify';
import { SettingsService } from '../../core/services/SettingsService';
import { AppearanceSystem } from '../../core/model/appearance-system.model';

// export interface settingsInterface {
//     username: string;
//     userAvatar: string;
//     darkTheme: boolean;
// }
class SettingsPage extends Component<{}, AppearanceSystem> {
    maxLength: number = 16;
    minLength: number = 4;
    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            userAvatar: '',
            darkTheme: false,
        };

        let userEngine: UserEngine = new UserEngine();

        userEngine.getCurrentUserName().then((name) => {
            this.setState({ username: name });
        });
        userEngine.getCurrentUserAvatar().then((avatar) => {
            this.setState({ userAvatar: avatar });
        });

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event: any) {
        const target: any = event.target;
        const value: any = target.type === 'checkbox' ? target.checked : target.value;
        const name: any = target.name;

        console.log(target.checked);

        this.setState({ ...this.state, [name]: value } as AppearanceSystem, () => {
            localStorage.setItem('luca-settings', JSON.stringify(this.state));
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="settings__container  scrollbar">
                        <div className="d-jcb d-aic">{/* <h1 className="page__header">Settings</h1> */}</div>
                        <div className="settings d-flex-col ">
                            <div className="setting d-flex d-aic d-jcb">
                                <div className="setting__info">
                                    <h1>User Name</h1>
                                    <p>This the name that will appear to other users in rooms</p>
                                </div>
                                <div className="input__container">
                                    <div className="input__room user__input">
                                        <input
                                            className=""
                                            type="text"
                                            name="username"
                                            id="username"
                                            onChange={this.handleInputChange}
                                            value={this.state.username}
                                            maxLength={this.maxLength}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="setting d-flex d-aic d-jcb">
                                <div className="setting__info">
                                    <h1>User Avatar</h1>
                                    <p>Select your avatar</p>
                                </div>
                                <div className="avatars__container">
                                    <div className="avatars__images">
                                        {[
                                            '0.svg',
                                            '1.svg',
                                            '2.svg',
                                            '3.svg',
                                            '4.svg',
                                            '5.svg',
                                            '6.svg',
                                            '7.svg',
                                            '8.svg',
                                            '9.svg',
                                            '10.svg',
                                        ].map((avatar, index) => {
                                            return (
                                                <img
                                                    key={index}
                                                    className={
                                                        'img-avatar ' +
                                                        (this.state.userAvatar == avatar ? 'img-avatar-selected' : '')
                                                    }
                                                    data-name={avatar}
                                                    src={'/assets/imgs/avatars/' + avatar}
                                                    onClick={this.changeAvatar}
                                                />
                                            );
                                        })}
                                    </div>
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
                                    <input
                                        className="mobileToggle"
                                        checked={this.state.darkTheme}
                                        onChange={this.handleInputChange}
                                        type="checkbox"
                                        name="darkTheme"
                                        id="darkTheme"
                                    />
                                    <label htmlFor="darkTheme"></label>
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

    changeUsername = (e: ChangeEvent) => {
        let userEngine: UserEngine = new UserEngine();
        let username = (e.target as HTMLInputElement).value;
        if (username.length < this.minLength) {
            toast.error('The username must be at least ' + this.minLength + ' characters', {
                toastId: 'error:username:minLengt',
            });
            this.setState({ username: username });
            return;
        }
        this.setState({ username: username });
        userEngine.setCurrentUserName(username);
        SettingsService.setUserName(username);
    };

    changeAvatar(el: React.MouseEvent<HTMLImageElement>) {
        let clickedImage: HTMLImageElement = el.target as HTMLImageElement;
        if (document.getElementsByClassName('img-avatar-selected')[0]) {
            document.getElementsByClassName('img-avatar-selected')[0].classList.remove('img-avatar-selected');
        }
        clickedImage.classList.add('img-avatar-selected');
        let userAvatar = clickedImage.dataset.name;
        let userEngine: UserEngine = new UserEngine();
        userEngine.setCurrentUserAvatar(userAvatar);
        SettingsService.setAvatar(userAvatar);
    }
    toggleTheme() {
        document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('settings', 'value');
    }
}

export default SettingsPage;
