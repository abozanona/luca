import React, { Component } from 'react';
const google = require('../../assets/imgs/google.svg');
const bug = require('../../assets/imgs/bug.svg');
class GeneralButton extends Component {
    render() {
        return (
            <React.Fragment>
                <button className={'btn ' + (this.props.class ?? 'btn--primary')} onClick={this.props.click}>
                    <span>{this.props.name}</span>
                    {this.props.icon && <img src={this.props.icon} alt="" />}
                </button>
                {/* <button className="btn btn--primary">
                    <img src={google} alt="" /> <span>Login/ Register</span>
                </button>
                <button className="btn btn--secondary"><span>Login/ Register</span></button>
                 */}
                {/* <button className="btn btn--danger">
                    <span>Login/ Register</span>
                    <div className="list__wraper">
                        <ul className="list__container">
                            <li>
                                <img src={bug} alt="" />
                                <a href="#">Support us </a>
                            </li>
                            <li>
                                <img src={bug} alt="" />
                                <a href="#">Support us </a>
                            </li>
                            <li>
                                <img src={bug} alt="" />
                                <a href="#">Support us </a>
                            </li>
                        </ul>
                    </div>
                </button> */}
            </React.Fragment>
        );
    }
}

export default GeneralButton;
