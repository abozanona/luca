import React, { Component } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import PopUpEngine from '../../js/popup-engine';
import { toast } from 'react-toastify';
import { UserInterface } from '../../js/luca/interfaces/user.interface';

const Copy = require('../../assets/imgs/copy.svg');
const Link = require('../../assets/imgs/link.svg');
const Setting = require('../../assets/imgs/setting.svg');
const Scan = require('../../assets/imgs/scan.svg');
const Leave = require('../../assets/imgs/leave.svg');
class PartyPage extends Component<{}, { roomId: string; roomLink: string; partyUsers: UserInterface[] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            roomId: '',
            roomLink: '',
            partyUsers: [],
        };
        let popupEngine: PopUpEngine = new PopUpEngine();
        let _this = this;
        popupEngine.getCurrentRoomId(function (roomId: string) {
            _this.setState({ roomId: roomId });
        });
        popupEngine.getCurrentRoomUrl(function (roomUrl) {
            _this.setState({ roomLink: roomUrl });
        });
        popupEngine.getCurrentRoomUsers(function (users: UserInterface[]) {
            _this.setState({ partyUsers: users });
        });
    }

    getRoomLink(): string {
        return `https://abozanona-luca.herokuapp.com/party/join?roomId=${
            this.state.roomId
        }&roomLink=${encodeURIComponent(this.state.roomLink)}`;
    }

    copyPartyId = () => {
        toast.success('Room id copied to your clipboard', {
            toastId: 'success:copy-room-id',
        });
        navigator.clipboard.writeText(this.state.roomId);
    };

    copyRoomLink = () => {
        toast.success('Room link copied to your clipboard', {
            toastId: 'success:copy-room-link',
        });
        navigator.clipboard.writeText(this.getRoomLink());
    };

    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="party__container">
                        <div className="d-jcb d-aic">
                            <h1 className="page__header">Partiers ({this.state.partyUsers.length})</h1>
                            <div className="party__settings d-aic g-1">
                                <img
                                    src={Link}
                                    className="party__copy-link"
                                    alt="Copy party link"
                                    title="Copy party link"
                                    onClick={this.copyRoomLink}
                                />
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
                                {(this.state.partyUsers ?? []).map((user, index) => {
                                    return <Avatar key={index} username={user.userName} avatar={user.userAvatar} />;
                                })}
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
