import React, { Component } from 'react';
import UtilsEngine from '../../js/luca/utils-engine';

class ChatPage extends Component<{}, { chatTemplateHTML: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            chatTemplateHTML: '',
        };
    }

    async componentDidMount() {
        let _this = this;
        UtilsEngine.loadTemplate('/templates/chat.template.html').then((chatTemplateHTML: string) => {
            _this.setState({
                chatTemplateHTML: chatTemplateHTML
                    .replace('{userName}', 'user.username')
                    .replace('{messageTime}', new Date().toLocaleTimeString())
                    .replace('{messageText}', 'messageText')
                    .replace(
                        '{userAvatar}',
                        UtilsEngine.browser.runtime.getURL('assets/imgs/avatars/' + 'user.userAvatar')
                    ),
            });
        });
    }

    render() {
        return (
            <React.Fragment>
                <div dangerouslySetInnerHTML={{ __html: this.state.chatTemplateHTML }}></div>
            </React.Fragment>
        );
    }
}

export default ChatPage;
