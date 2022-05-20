import React, { Component } from 'react';
import navConfig from '../../constant/nav.config';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import UserEngine from '../../js/luca/user-engine';
import { SettingsService } from '../../core/services/SettingsService';
import { Subscription } from 'rxjs';
const CopyCode = require('../../assets/imgs/copy-code.svg');
const Options = require('../../assets/imgs/options.svg');
const Bug = require('../../assets/imgs/bug.png');
const Chat = require('../../assets/imgs/chat.svg');
const Website = require('../../assets/imgs/website.svg');
const SupportUs = require('../../assets/imgs/support_us.svg');
const RateUs = require('../../assets/imgs/rate_us.svg');
import { toast } from 'react-toastify';
class Navbar extends Component<{}, { userName: string; userAvatar: string; userId: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            userName: '',
            userAvatar: '',
            userId: '',
        };

        let userEngine: UserEngine = new UserEngine();
        userEngine.getCurrentUserName().then((name) => {
            this.setState({ userName: name });
        });
        userEngine.getCurrentUserAvatar().then((avatar) => {
            this.setState({ userAvatar: avatar });
        });
        userEngine.getUserId().then((userId) => {
            this.setState({ userId: userId });
        });
    }
    avatarSubscription: Subscription;
    usernameSubscription: Subscription;
    componentDidMount() {
        this.avatarSubscription = SettingsService.getAvatar().subscribe((avatar: any) => {
            if (avatar) {
                this.setState({ userAvatar: avatar });
            } else {
                this.setState({ userAvatar: '0.svg' });
            }
        });
        this.usernameSubscription = SettingsService.getUserName().subscribe((name: any) => {
            if (name) {
                this.setState({ userName: name });
            } else {
                this.setState({ userName: 'Luca User' });
            }
        });
    }

    componentWillUnmount() {
        this.avatarSubscription.unsubscribe();
    }

    copyUserId = () => {
        toast.success('User id copied to your clipboard', {
            toastId: 'success:copy-user-id',
        });
        navigator.clipboard.writeText(this.state.userId);
    };

    render() {
        return (
            <div className="navbar__container">
                <div className="navbar__avatar">
                    <Avatar avatar={this.state.userAvatar} />
                    <div className="avatar__information">
                        <h5>{this.state.userName}</h5>
                        <p>
                            {this.state.userId}
                            <span>
                                <img src={CopyCode} alt="Copy user id" title="Copy user id" onClick={this.copyUserId} />
                            </span>
                        </p>
                    </div>
                </div>
                <div className="navbar__elements">
                    {navConfig.map((item, index) => {
                        return (
                            <div className="element" key={index}>
                                <Link to={item.to}>
                                    <img src={item.icon} alt={item.name} />
                                </Link>
                            </div>
                        );
                    })}

                    <div className="element element__option">
                        <img src={Options} alt="" />
                        <div className="options__list">
                            <a href="https://github.com/abozanona/luca/issues" target="_blank">
                                <img src={Bug} alt="" />
                                <p>Report Bug</p>
                            </a>
                            <a href="https://discord.gg/T3uvQupA" target="_blank">
                                <img src={Chat} alt="" />
                                <p>Contact us</p>
                            </a>
                            <a href="https://cotede.co/" target="_blank">
                                <img src={Website} alt="" />
                                <p>Website</p>
                            </a>
                            <a href="https://www.buymeacoffee.com/lucamovices" target="_blank">
                                <img src={SupportUs} alt="" />
                                <p>Support us</p>
                            </a>
                            <a
                                href="https://chrome.google.com/webstore/detail/luca-movies-and-videos-pa/obnoakbedffbolampagecgineggakiii/reviews"
                                target="_blank"
                            >
                                <img src={RateUs} alt="" />
                                <p>Rate us</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Navbar;
