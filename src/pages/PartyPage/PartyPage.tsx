import React, { Component } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import GeneralList from '../../components/GeneralList/GeneralList';
import PopUpEngine from '../../js/popup-engine';
const Copy = require('../../assets/imgs/copy.svg');
const Setting = require('../../assets/imgs/setting.svg');
const Scan = require('../../assets/imgs/scan.svg');
const Leave = require('../../assets/imgs/leave.svg');
class PartyPage extends Component<{}, { roomId: string; roomLink: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            roomId: '',
            roomLink: '',
        };
        let popupEngine: PopUpEngine = new PopUpEngine();
        let _this = this;
        popupEngine.getCurrentRoomId(function (roomId: string) {
            _this.setState({ roomId: roomId });
        });
        popupEngine.getCurrentRoomUrl(function (roomUrl) {
            _this.setState({ roomLink: roomUrl });
        });
    }

    getRoomLink(): string {
        return `https://abozanona-luca.herokuapp.com/party?id=${this.state.roomId}&link=${encodeURIComponent(
            this.state.roomLink
        )}`;
    }

    copyPartyId = () => {
        navigator.clipboard.writeText(this.state.roomId);
    };

    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="party__container">
                        <div className="d-jcb d-aic">
                            <h1 className="page__header">Party (2)</h1>
                            <div className="party__settings d-aic g-1">
                                {this.state.roomId}
                                <img
                                    src={Copy}
                                    className="party__copy-id"
                                    alt="Copy party id"
                                    title="Copy party id"
                                    onClick={this.copyPartyId}
                                />
                                <img src={Setting} alt="Party settings" title="Party settings" />
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
