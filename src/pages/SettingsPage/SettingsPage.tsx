import React, { ChangeEvent, Component, useState } from 'react';
import UserEngine from '../../js/luca/user-engine';
import { toast } from 'react-toastify';
import { SettingsService } from '../../core/services/SettingsService';
import { Settings } from '../../core/model/settings.model';
import UtilsEngine from '../../js/luca/utils-engine';

class SettingsPage extends Component<{}, Settings> {
    maxLength: number = 16;
    minLength: number = 4;

    constructor(props: Settings) {
        super(props);
        this.state = new Settings();
        UserEngine.getSettings().then((settings: Settings) => {
            this.setState(settings);
        });

        this.handleInputChange = this.handleInputChange.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);
    }

    handleInputChange = (event: any) => {
        const target: any = event.target;
        const value: any = target.type === 'checkbox' ? target.checked : target.value;
        const name: any = target.name;

        this.setState({ ...this.state, [name]: value } as Settings, () => {
            UserEngine.setSettings(this.state);
            SettingsService.setSettingsChange({ ...this.state });
            SettingsService.setTheme({ ...this.state });
        });
    };

    changeAvatar = (el: React.MouseEvent<HTMLImageElement>) => {
        let clickedImage: HTMLImageElement = el.target as HTMLImageElement;
        let imageAvatar = document.getElementsByClassName('img-avatar-selected')[0];

        imageAvatar ? imageAvatar.classList.remove('img-avatar-selected') : null;
        clickedImage.classList.add('img-avatar-selected');

        this.setState({ userAvatar: clickedImage.dataset.name }, () => {
            UserEngine.setSettings({ ...this.state });
            SettingsService.setSettingsChange({ ...this.state });
        });
    };

    changeUsername = (e: ChangeEvent) => {
        let username = (e.target as HTMLInputElement).value;
        if (username.length < this.minLength) {
            toast.error('The username must be at least ' + this.minLength + ' characters', {
                toastId: 'error:username:minLengt',
            });
            this.setState({ username: username });
            return;
        }

        this.setState({ username: username }, () => {
            UserEngine.setSettings({ ...this.state });
            SettingsService.setSettingsChange({ ...this.state });
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="settings__container  scrollbar">
                        <div className="d-jcb d-aic">{/* <h1 className="page__header">Settings</h1> */}</div>
                        <div className="settings d-flex-col ">
                            <div className="setting d-flex d-aic d-jcb">
                                <div className="setting__info">
                                    <h1>{UtilsEngine.translate('SETTINGS_USER_NAME')}</h1>
                                    <p>{UtilsEngine.translate('SETTINGS_USER_NAME_NNOTICE')}</p>
                                </div>
                                <div className="input__container">
                                    <div className="input__room user__input">
                                        <input
                                            className=""
                                            type="text"
                                            name="username"
                                            id="username"
                                            onChange={this.changeUsername}
                                            value={this.state.username}
                                            maxLength={this.maxLength}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="setting d-flex d-aic d-jcb">
                                <div className="setting__info">
                                    <h1>{UtilsEngine.translate('SETTINGS_USER_AVATAR')}</h1>
                                    <p>{UtilsEngine.translate('SETTINGS_USER_AVATAR_NOTICE')}</p>
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
                                    <h1>{UtilsEngine.translate('SETTINGS_DARK_THEME')}</h1>
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
                                    <h1>{UtilsEngine.translate('SETTINGS_ENABLE_SHORTCUTS')}</h1>
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
                                    <h1>{UtilsEngine.translate('SETTINGS_SHOW_ACTIONS')}</h1>
                                    <p>{UtilsEngine.translate('SETTINGS_SHOW_ACTIONS_NOTICE')}</p>
                                </div>
                                <div className="toggleWrapper">
                                    <input className="mobileToggle" type="checkbox" name="indecaters" id="indecaters" />
                                    <label htmlFor="indecaters"></label>
                                </div>
                            </div>
                            <div className="setting d-flex d-aic d-jcb">
                                <div className="setting__info">
                                    <h1>{UtilsEngine.translate('SETTINGS_PLAY_SOUNDS')}</h1>
                                    <p>{UtilsEngine.translate('SETTINGS_PLAY_SOUNDS_NOTICE')}</p>
                                </div>
                                <div className="toggleWrapper">
                                <input
                                        className="mobileToggle"
                                        checked={this.state.playSounds}
                                        onChange={this.handleInputChange}
                                        type="checkbox"
                                        name="playSounds"
                                        id="playSounds"
                                    />
                                    <label htmlFor="playSounds"></label>
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
