import React, { Component } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
const AddFriend = require('../../assets/imgs/add-friend.svg');
const Soon = require('../../assets/imgs/soon.svg');
class FriendsPage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="page__content d-flex-col d-aic d-jcc">
                        <img src={Soon} alt="" />
                        <h1>Friends is coming soon!</h1>
                        <p>
                            Soon you will be able to create your own friends list and invite them to watch movies togother.
                        </p>
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
