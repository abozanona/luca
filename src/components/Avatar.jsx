import React, { Component } from 'react';

var cronw = require('../assets/imgs/crown.svg');
class Avatar extends Component {
    render() {
        return (
            <div className="avatar_container">
                <div className="avatar__image">
                    <span className="avatar__crown">
                        {/* <img src={cronw} alt="" /> */}
                    </span>
                    <img src="https://i.pinimg.com/564x/70/ab/7b/70ab7b9eb95c0543e0d1ab4cd4b3152b.jpg" alt="" />
                    <span className="avatar__status"></span>
                </div>
                {/* <p className="avatar__name">skafi ps</p> */}
                {/* //TODO:Read from state */}
            </div>
        );
    }
}

export default Avatar;
