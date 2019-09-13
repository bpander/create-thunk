import React from 'react';
import { MessageFormContainer } from 'modules/message/containers/MessageForm';
import { MessagePaneContainer } from 'modules/message/containers/MessagePane';

const App: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div style={{ borderRight: '1px solid #999999', width: 300 }}>
                <h1>Messages</h1>
                <ul className="list-reset">
                    <li>Person 1</li>
                </ul>
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1 }}>
                    <MessagePaneContainer />
                </div>
                <div style={{ padding: 20 }}>
                    <MessageFormContainer />
                </div>
            </div>
        </div>
    );
}

export default App;
