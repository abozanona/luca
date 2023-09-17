import React, { ChangeEvent } from 'react';
import { NavigateFunction } from 'react-router-dom';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import UtilsEngine from '../../js/luca/utils-engine';
import PopUpEngine from '../../js/popup-engine';
import { toast } from 'react-toastify';
const Plus = require('../../assets/imgs/plus.svg');
const RoomId = require('../../assets/imgs/room-id.svg');
const Arrow = require('../../assets/imgs/arrow.svg');
class DashboardPage extends React.Component<{ navigate: NavigateFunction }, { createRoom: boolean; roomId: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            createRoom: true,
            roomId: '',
        };

        let popupEngine: PopUpEngine = new PopUpEngine();
        popupEngine.getCurrentPageStatus((currentPage: string) => {
            switch (currentPage) {
                case 'ROOM_SETUP_COMPLETED':
                    this.props.navigate('/party', { replace: true });
                    break;
            }
        });
    }

    createRoom = () => {
        let popupEngine: PopUpEngine = new PopUpEngine();
        popupEngine.createRoom();
        this.props.navigate('/selectvideo');
    };

    joinRoom = () => {
        if (!this.state.roomId) {
            toast.error('Room name can\'t be empty', {
                toastId: 'error:joinRoom:emptyRommId',
            });
            return;
        }
        let popupEngine: PopUpEngine = new PopUpEngine();
        popupEngine.joinRoom(this.state.roomId);
        this.props.navigate('/selectvideo');
    };

    handleOnKeyDown = (e: any) => {
        this.setState({ roomId: (e.target as HTMLInputElement).value });
        if (e.key === 'Enter') {
            this.joinRoom();
        }
    };

    toggleCreateParty = () => {
        this.setState({ createRoom: !this.state.createRoom });
    }

    render() {
        return this.state.createRoom ? (
            <React.Fragment>
                <div className="page__container">
                    <div className="dashboard__container d-flex-col">
                        <div className="dashboard__info d-flex-col d-jcc d-aic">
                            <h1>{UtilsEngine.translate('DASHBOARD_CREATE_ROOM_HEADER')}</h1>
                        </div>
                        <div className="room__action">
                            <div onClick={this.createRoom} className="create__room__container d-flex-col d-aic">
                                <img src={Plus} alt="" />
                                {UtilsEngine.translate('DASHBOARD_CREATE_ROOM')}
                            </div>
                        </div>
                        <div className="dashboard__notice d-flex-col d-jcc d-aic">
                            <p onClick={this.toggleCreateParty}>{UtilsEngine.translate('DASHBOARD_JOIN_ROOM_LINK')}</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <div className="page__container">
                    <div className="dashboard__container d-flex-col">
                        <div className="dashboard__info d-flex-col d-jcc d-aic">
                            <h1>{UtilsEngine.translate('DASHBOARD_JOIN_ROOM_HEADER')}</h1>
                            <p>{UtilsEngine.translate('DASHBOARD_JOIN_ROOM_DESCRIPTION')}</p>
                        </div>
                        <div className="room__action">
                            <div className="input__container">
                                <label htmlFor="roomid">{UtilsEngine.translate('DASHBOARD_ROOM_ID')}</label>
                                <div className="input__room">
                                    <img src={RoomId} alt="" />
                                    <input
                                        onKeyDown={this.handleOnKeyDown}
                                        type="text"
                                        name="roomid"
                                    />
                                </div>
                            </div>
                            <div className="d-aic d-flex-col">
                                <label htmlFor="">‎‎&nbsp;</label>
                                <GeneralButton
                                    name={UtilsEngine.translate('DASHBOARD_JOIN')}
                                    icon={Arrow}
                                    click={this.joinRoom}
                                />
                            </div>
                        </div>
                        <div className="dashboard__notice d-flex-col d-jcc d-aic">
                            <p onClick={this.toggleCreateParty}>{UtilsEngine.translate('DASHBOARD_CREATE_ROOM_LINK')}</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DashboardPage;
