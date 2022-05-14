import React, { Component } from 'react';
import navConfig from '../../constant/nav.config';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import PopUpEngine from '../../js/popup-engine';
const CopyCode = require('../../assets/imgs/copy-code.svg');

class Navbar extends Component<{}, { userName: string; userId: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            userName: '',
            userId: '',
        };
        let popupEngine: PopUpEngine = new PopUpEngine();
        popupEngine.getCurrentUserName((name) => {
            this.setState({ userName: name });
        });
    }

    render() {
        return (
            <div className="navbar__container">
                <div className="navbar__avatar">
                    <Avatar />
                    <div className="avatar__information">
                        <h5>{this.state.userName}</h5>
                        <p>
                            {this.state.userId}
                            <span>
                                <img src={CopyCode} alt="" />
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
                </div>
            </div>
        );
    }
}

export default Navbar;
