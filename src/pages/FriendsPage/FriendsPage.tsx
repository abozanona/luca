import React, { Component } from 'react';
import UtilsEngine from '../../js/luca/utils-engine';
const Soon = require('../../assets/imgs/soon.svg');
class FriendsPage extends Component {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="page__content d-flex-col d-aic d-jcc">
                        <img src={Soon} alt="" />
                        <h1>{UtilsEngine.translate('FRIENDS_FRIENDS_COMING_SOON')}</h1>
                        <p>{UtilsEngine.translate('FRIENDS_FRIENDS_COMING_SOON_NOTICE')}</p>
                    </div>
                </div>
                {/* <div className="page__container">
                    <div className="friends__container">
                        <div className="d-jcb d-aic">
                            <h1 className="page__header">Friends</h1>
                        </div>
                        <h1 className="soon__container">SOON!</h1> */}

                {/* <div className="page__memebers">
                            <div className="friend__memebr">
                                <Avatar username="Mahmoud" />
                            </div>
                            <div className="friend__memebr">
                                <Avatar username="Mahmoud" />
                            </div>
                            <div className="friend__memebr">
                                <Avatar username="Mahmoud" />
                            </div>
                            <div className="friend__memebr">
                                <Avatar username="Mahmoud" />
                            </div>
                            <div className="friend__memebr">
                                <Avatar username="Mahmoud" />
                            </div>
                        </div>
                        <div className="page__actions d-aic g-1">
                            <GeneralButton name="Add Friend" icon={AddFriend}></GeneralButton>
                        </div> */}
                {/* </div> */}
                {/* </div> */}
            </React.Fragment>
        );
    }
}

export default FriendsPage;
