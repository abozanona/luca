import React, { Component } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
import PopUpEngine from '../../js/popup-engine';
import { toast } from 'react-toastify';

const Copy = require('../../assets/imgs/copy.svg');
const Link = require('../../assets/imgs/link.svg');
const Setting = require('../../assets/imgs/setting.svg');
const Scan = require('../../assets/imgs/scan.svg');
const Leave = require('../../assets/imgs/leave.svg');
class PartyPage extends Component<{}, { roomId: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            roomId: '',
        };
        let popupEngine: PopUpEngine = new PopUpEngine();
        let _this = this;
        popupEngine.getCurrentRoomId(function (roomId: string) {
            _this.setState({ roomId: roomId });
        });
    }

    copyPartyId = () => {
        toast.success('Room id Copied to your clipboard', {
            toastId: 'success:copy',
        });
        navigator.clipboard.writeText(this.state.roomId);
    };

    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="party__container">
                        <div className="d-jcb d-aic">
                            <h1 className="page__header">Party</h1>
                            <div className="party__settings d-aic g-1">
                                <img
                                    src={Link}
                                    className="party__copy-id"
                                    alt="Copy party id"
                                    title="Copy party id"
                                    onClick={this.copyPartyId}
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
