import React, { Component } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import GeneralList from '../../components/GeneralList/GeneralList';
const Copy = require('../../assets/imgs/copy.svg');
const Setting = require('../../assets/imgs/setting.svg');
const Scan = require('../../assets/imgs/scan.svg');
const Leave = require('../../assets/imgs/leave.svg');
class PartyPage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="party__container">
                        <div className="d-jcb d-aic">
                            <h1 className="page__header">Party (2)</h1>
                            <div className="party__settings d-aic g-1">
                                <img src={Copy} alt="" />
                                <img src={Setting} alt="" />
                            </div>
                        </div>
                        <div className="party__members-container">
                            <div className="page__memebers">
                                <div className="party__member">
                                    <Avatar username="MaD Ps" />
                                    <GeneralList />
                                </div>
                                <Avatar username="MaD Ps" />
                                <Avatar username="MaD Ps" />
                                <Avatar username="MaD Ps" />
                                <Avatar username="MaD Ps" />
                                <div className="party__member">
                                    <Avatar username="MaD Ps" />
                                    <GeneralList />
                                </div>
                                <Avatar username="MaD Ps" />
                                <div className="party__member">
                                    <Avatar username="MaD Ps" />
                                    <GeneralList />
                                </div>
                                <Avatar username="MaD Ps" />
                                <Avatar username="MaD Ps" />
                                <Avatar username="MaD Ps" />
                                <Avatar username="MaD Ps" />
                                <div className="party__member">
                                    <Avatar username="MaD Ps" />
                                    <GeneralList />
                                </div>
                                <Avatar username="MaD Ps" />
                            </div>
                        </div>
                        <div className="page__actions d-aic g-1">
                            <GeneralButton name="Scan" icon={Scan}></GeneralButton>
                            <GeneralButton class="btn--danger" name="Leave" icon={Leave}></GeneralButton>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PartyPage;
