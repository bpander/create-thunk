import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendMessage, SendRequest } from 'modules/message/duck';
import { RootDispatch, RootState } from 'root';
import { uniqueId } from 'lib/uniqueId';

interface MessageFormProps {
    recipientId: string;
    sendMessage: (sendRequest: SendRequest) => void;
}

export const MessageForm: React.FC<MessageFormProps> = props => {
    const [ message, setMessage ] = useState('');

    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            return;
        }
        props.sendMessage({ text: message, recipientId: props.recipientId, tempId: uniqueId() });
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

const mapStateToProps = (state: RootState) => ({
    recipientId: 'lkj',
});

const mapDispatchToProps = (dispatch: RootDispatch) => bindActionCreators({
    sendMessage,
}, dispatch);

export const MessageFormContainer = connect(mapStateToProps, mapDispatchToProps)(MessageForm);
