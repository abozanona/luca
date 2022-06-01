import React, { ChangeEvent } from 'react';
import { NavigateFunction } from 'react-router-dom';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import UtilsEngine from '../../js/luca/utils-engine';
import PopUpEngine from '../../js/popup-engine';
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

    handleOnClick = () => {
        let popupEngine: PopUpEngine = new PopUpEngine();
        if (this.state.createRoom) {
            popupEngine.createRoom();
        } else {
            popupEngine.joinRoom(this.state.roomId);
        }
        this.props.navigate('/selectvideo');
    };

    handleOnChange = (e: ChangeEvent) => {
        this.setState({ roomId: (e.target as HTMLInputElement).value });
        if ((e.target as HTMLInputElement).value) {
            this.setState({ createRoom: false });
        } else {
            this.setState({ createRoom: true });
        }
    };

    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="dashboard__container d-flex-col">
                        <div className="room__action">
                            <div className="input__container">
                                <label htmlFor="roomid">{UtilsEngine.translate('DASHBOARD_ROOM_ID')}</label>
                                <div className="input__room">
                                    <img src={RoomId} alt="" />
                                    <input onChange={this.handleOnChange} type="text" name="roomid" />
                                </div>
                            </div>
                            <div className="d-aic d-flex-col">
                                <label htmlFor="">‎‎&nbsp;</label>
                                <GeneralButton
                                    name={
                                        this.state.createRoom
                                            ? UtilsEngine.translate('DASHBOARD_CREATE')
                                            : UtilsEngine.translate('DASHBOARD_JOIN')
                                    }
                                    icon={Arrow}
                                    click={this.handleOnClick}
                                />
                            </div>
                        </div>
                        <div className="dashboard__info d-flex-col d-jcc d-aic">
                            <h1>{UtilsEngine.translate('DASHBOARD_GET_STARTED_CREATE_OR_JOIN')}</h1>
                            <p>{UtilsEngine.translate('DASHBOARD_GET_STARTED_CREATE_OR_JOIN_NOTICE')}</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DashboardPage;
