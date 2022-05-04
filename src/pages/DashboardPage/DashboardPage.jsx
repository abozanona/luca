import React, { Component } from 'react';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
const RoomId = require('../../assets/imgs/room-id.svg');
const Arrow = require('../../assets/imgs/arrow.svg');
class DashboardPage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="dashboard__container d-flex-col">
                        <div className="room__action">
                            <div className="input__container">
                                <label htmlFor="roomid">Room ID</label>
                                <div className="input__room">
                                    <img src={RoomId} alt="" />
                                    <input type="text" name="roomid" />
                                </div>
                            </div>
                            <div className="d-aic d-flex-col">
                                <label htmlFor="">‎‎&nbsp;</label>
                                <GeneralButton  name="Join/ Create" icon={Arrow} />
                            </div>
                        </div>
                        <div className="dashboard__info d-flex-col d-jcc d-aic">
                            <h1>Get Started, by Create/Join Room! </h1>
                            <p> Put some information here. Put some informationhere Put some information here.</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DashboardPage;
