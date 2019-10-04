import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { MessageState, SendRequest, sendMessage, cancelMessage, initialMessageState } from 'modules/message/duck';
import { RootState, RootDispatch } from 'root';
import { loadAll } from '../duck';
import { bindActionCreators } from 'redux';
import { wrap } from 'lib/keyedSubStates';

interface MessagePaneProps {
    message: MessageState;
    loadAll: (recipientId: string) => void;
    sendMessage: (sendRequest: SendRequest) => void;
    cancelMessage: (recipientId: string, tempId: string) => void;
}

export const MessagePane: React.FC<MessagePaneProps> = props => {
    const { loadAll } = props;
    useEffect(() => { loadAll('lkj'); }, [ loadAll ]);

    if (props.message.loadAllStatus.loading) {
        return <span>loading...</span>;
    }

    const onRetryClick = (sendRequest: SendRequest) => () => {
        props.sendMessage(sendRequest);
    };

    const onCancelClick = (sendRequest: SendRequest) => () => {
        props.cancelMessage(sendRequest.recipientId, sendRequest.tempId);
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
    message: state.recipient['lkj'] || initialMessageState,
});

const mapDispatchToProps = (dispatch: RootDispatch) => bindActionCreators({
    loadAll,
    sendMessage,
    cancelMessage: (recipientId: string, tempId: string) => wrap(recipientId, cancelMessage(tempId)),
}, dispatch);

export const MessagePaneContainer = connect(mapStateToProps, mapDispatchToProps)(MessagePane);
