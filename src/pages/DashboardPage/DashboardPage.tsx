import React, { ChangeEvent } from 'react';
import { NavigateFunction } from 'react-router-dom';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
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
                                <label htmlFor="roomid">Room ID</label>
                                <div className="input__room">
                                    <img src={RoomId} alt="" />
                                    <input onChange={this.handleOnChange} type="text" name="roomid" />
                                </div>
                            </div>
                            <div className="d-aic d-flex-col">
                                <label htmlFor="">‎‎&nbsp;</label>
                                <GeneralButton
                                    name={this.state.createRoom ? 'Create' : 'Join'}
                                    icon={Arrow}
                                    click={this.handleOnClick}
                                />
                            </div>
                        </div>
                        <div className="dashboard__info d-flex-col d-jcc d-aic">
                            <h1>Get Started, by Create/Join Room! </h1>
                            <p>
                                Click on create to start a new party or enter a room id to join an already existing
                                party.
                            </p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DashboardPage;
