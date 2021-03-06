import React, { Component } from 'react';
const Cronw = require('../../assets/imgs/crown.svg');
const DefaultAvatar = require('../../assets/imgs/default-avatar.svg');
class Avatar extends Component<{ username?: string; avatar?: string }> {
    userName() {
        if (!this.props.username) return;
        return this.props.username.substring(0, 10) + '..';
    }
    render() {
        return (
            <div className="avatar_container">
                <div className="avatar__image d-aic">
                    <span className="avatar__crown">{/* <img src={cronw} alt="" /> */}</span>
                    <img src={'/assets/imgs/avatars/' + this.props.avatar} alt="" />
                    <span className="avatar__status"></span>
                </div>
                <p className="avatar__name">{this.userName()}</p>
            </div>
        );
    }
}

export default Avatar;
