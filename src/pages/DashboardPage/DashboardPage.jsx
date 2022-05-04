import React, { useCallback, Component } from 'react';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import { useNavigate } from 'react-router-dom';
const RoomId = require('../../assets/imgs/room-id.svg');
const Arrow = require('../../assets/imgs/arrow.svg');
function DashboardPage() {
    const navigate = useNavigate();
    const handleOnClick = useCallback(() => navigate('/party', { replace: true }), [navigate]);
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
                            <GeneralButton name="Join/ Create" icon={Arrow} click={handleOnClick} />
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

export default DashboardPage;
