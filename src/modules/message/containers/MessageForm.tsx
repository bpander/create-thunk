import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendMessage } from 'modules/message/duck';
import { RootDispatch } from 'root';

interface MessageFormProps {
    sendMessage: (text: string) => void;
}

export const MessageForm: React.FC<MessageFormProps> = props => {
    const [ message, setMessage ] = useState('');

    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            return;
        }
        props.sendMessage(message);
        setMessage('');
    };

    return (
        <form noValidate onSubmit={onSubmit} style={{ display: 'flex', width: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                <input
                    value={message}
                    onChange={e => setMessage(e.currentTarget.value)}
                    required
                    className="input"
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
                <button className="btn">Send</button>
            </div>
        </form>
    );
};

const mapDispatchToProps = (dispatch: RootDispatch) => bindActionCreators({
    sendMessage,
}, dispatch);

export const MessageFormContainer = connect(null, mapDispatchToProps)(MessageForm);
