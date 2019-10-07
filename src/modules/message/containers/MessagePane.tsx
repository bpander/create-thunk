import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { sendMessage, cancelMessage, initialMessageState } from 'modules/message/duck';
import { RootState } from 'root';
import { loadAll } from '../duck';
import { memoizeThunk, shouldCall } from 'lib/createThunk';

export const MessagePaneContainer: React.FC = () => {
    const chatId = useSelector((state: RootState) => state.chat.activeChat || '');
    const messageState = useSelector((state: RootState) => state.recipient[chatId] || initialMessageState);
    const dispatch = useDispatch();
    
    const { loadAllStatus } = messageState;
    useEffect(() => {
        const loadAllIfNeeded = memoizeThunk(loadAll, shouldCall({ status: loadAllStatus, maxAge: 1000 * 5 }));
        if (chatId && !loadAllStatus.error) {
            dispatch(loadAllIfNeeded(chatId));
        }
    }, [ dispatch, chatId, loadAllStatus ]);

    return (
        <React.Fragment>
            <ul>
                {messageState.messages.map(message => (
                    <li key={message.id}>{message.text}</li>
                ))}
            </ul>
            <ul>
                {Object.keys(messageState.sendStatuses).map(key => {
                    const request = messageState.sendStatuses[key];
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
                                        onClick={() => dispatch(sendMessage(sendRequest))}
                                    >
                                        Retry?
                                    </button>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => dispatch(cancelMessage(sendRequest.recipientId, sendRequest.tempId))}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            {(messageState.loadAllStatus.loading) && (
                <span>loading...</span>
            )}
            {(messageState.loadAllStatus.error) && (
                <span>
                    An error occurred.{' '}
                    <button className="btn" onClick={() => dispatch(loadAll(chatId))}>Retry?</button>
                </span>
            )}
        </React.Fragment>
    );
}
