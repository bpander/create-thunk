import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { sendMessage, cancelMessage, initialMessageState } from 'modules/message/duck';
import { RootState } from 'root';
import { loadAll } from '../duck';
import { memoizeThunk, isStale } from 'lib/createThunk';

export const MessagePaneContainer: React.FC = () => {
    const chatId = useSelector((state: RootState) => state.chat.activeChat || '');
    const messageState = useSelector((state: RootState) => state.recipient[chatId] || initialMessageState);
    const dispatch = useDispatch();
    
    const { loadAllState } = messageState;
    useEffect(() => {
        const loadAllIfNeeded = memoizeThunk(loadAll, isStale({ state: loadAllState, maxAge: 1000 * 5 }));
        if (chatId && !loadAllState.error) {
            dispatch(loadAllIfNeeded(chatId));
        }
    }, [ dispatch, chatId, loadAllState ]);

    return (
        <React.Fragment>
            <ul>
                {messageState.messages.map(message => (
                    <li key={message.id}>{message.text}</li>
                ))}
            </ul>
            <ul>
                {Object.keys(messageState.sendStates).map(key => {
                    const request = messageState.sendStates[key];
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
            {(messageState.loadAllState.loading) && (
                <span>loading...</span>
            )}
            {(messageState.loadAllState.error) && (
                <span>
                    An error occurred.{' '}
                    <button className="btn" onClick={() => dispatch(loadAll(chatId))}>Retry?</button>
                </span>
            )}
        </React.Fragment>
    );
}
