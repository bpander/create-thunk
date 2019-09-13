import React from 'react';
import { MessageFormContainer } from 'modules/message/containers/MessageForm';
import { MessagePaneContainer } from 'modules/message/containers/MessagePane';

const App: React.FC = () => {
    return (
        <div>
            <MessagePaneContainer />
            <MessageFormContainer />
        </div>
    );
}

export default App;
