import React from 'react';

import { DebugMenuContainer } from 'modules/debug/containers/DebugMenuContainer';
import { MessageFormContainer } from 'modules/message/containers/MessageForm';
import { MessagePaneContainer } from 'modules/message/containers/MessagePane';
import { ChatsContainer } from 'modules/chat/containers/ChatContainer';

const App: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div style={{ borderRight: '1px solid #999999', width: 300 }}>
                <ChatsContainer />
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1 }}>
                    <MessagePaneContainer />
                </div>
                <div style={{ padding: 20 }}>
                    <MessageFormContainer />
                </div>
            </div>
            <div style={{ position: 'fixed', top: 0, right: 20 }}>
                <DebugMenuContainer />
            </div>
        </div>
    );
}

export default App;
