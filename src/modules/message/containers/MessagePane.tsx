import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { MessageState, SendRequest, sendMessage, cancelMessage, initialState } from 'modules/message/duck';
import { RootState, RootDispatch, wrap } from 'root';
import { loadAll } from '../duck';
import { bindActionCreators } from 'redux';

interface MessagePaneProps {
    message: MessageState;
    loadAll: (recipientId: string) => void;
    sendMessage: (sendRequest: SendRequest) => void;
    cancelMessage: (tempId: string) => void;
}

export const MessagePane: React.FC<MessagePaneProps> = props => {
    const { loadAll } = props;
    useEffect(() => { loadAll(''); }, [ loadAll ]);

    if (props.message.loadAllStatus.loading) {
        return <span>loading...</span>;
    }

    const onRetryClick = (sendRequest: SendRequest) => () => {
        props.sendMessage(sendRequest);
    };

    const onCancelClick = (sendRequest: SendRequest) => () => {
        props.cancelMessage(sendRequest.tempId);
    };

    return (
        <React.Fragment>
            <ul>
                {props.message.messages.map(message => (
                    <li key={message.id}>{message.text}</li>
                ))}
            </ul>
            <ul>
                {Object.keys(props.message.sendStatuses).map(key => {
                    const request = props.message.sendStatuses[key];
                    const [ sendRequest ] = request.args;
                    return (
                        <li key={sendRequest.tempId} style={{ opacity: (request.loading) ? 0.5 : 1 }}>
                            {sendRequest.text}
                            {(request.error) && (
                                <div>
                                    <span style={{ color: 'red' }}>Couldn't send</span>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={onRetryClick(sendRequest)}
                                    >
                                        Retry?
                                    </button>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={onCancelClick(sendRequest)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </React.Fragment>
    );
};

const mapStateToProps = (state: RootState) => ({
    message: state.recipient['lkj'] || initialState,
});

const mapDispatchToProps = (dispatch: RootDispatch) => bindActionCreators({
    loadAll: (recipientId: string) => wrap('lkj', loadAll(recipientId)),
    sendMessage,
    cancelMessage,
}, dispatch);

export const MessagePaneContainer = connect(mapStateToProps, mapDispatchToProps)(MessagePane);
