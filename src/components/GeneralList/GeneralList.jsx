import React, { Component } from 'react';
const bug = require('../../assets/imgs/bug.svg');

class GeneralList extends Component {
    render() {
        return (
            <React.Fragment>
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
            </React.Fragment>
        );
    }
}

export default GeneralList;
