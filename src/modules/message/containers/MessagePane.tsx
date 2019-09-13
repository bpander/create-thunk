import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { MessageState } from 'modules/message/duck';
import { RootState, RootDispatch } from 'root';
import { loadAll } from '../duck';

interface MessagePaneProps {
    message: MessageState;
    dispatch: RootDispatch;
}

export const MessagePane: React.FC<MessagePaneProps> = props => {
    const { dispatch } = props;
    useEffect(() => { dispatch(loadAll('')) }, [ dispatch ]);

    if (props.message.loadAllStatus.loading) {
        return <span>loading...</span>;
    }

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
                    return (
                        <li key={request.id} style={{ opacity: (request.loading) ? 0.5 : 1 }}>
                            {request.args[0]}
                            {(request.error) && (
                                <div>
                                    <span style={{ color: 'red' }}>Couldn't send</span>
                                    <button type="button" className="btn">Retry?</button>
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
    message: state.message,
});

export const MessagePaneContainer = connect(mapStateToProps)(MessagePane);
