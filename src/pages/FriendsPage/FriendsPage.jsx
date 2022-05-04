import React, { Component } from 'react';
import Avatar from '../../components/Avatar';
import GeneralButton from '../../components/GeneralButton/GeneralButton';
const AddFriend = require('../../assets/imgs/add-friend.svg');
class FriendsPage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="page__container">
                    <div className="friends__container">
                        <div className="d-jcb d-aic">
                            <h1 className="page__header">Friends (4)</h1>
                        </div>
                        <div className="page__memebers">
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
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FriendsPage;
