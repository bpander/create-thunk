import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'root';
import { loadChats, setActiveChat } from '../duck';

export const ChatsContainer: React.FC = () => {
    const { chats, loadChatsStatus, activeChat } = useSelector((state: RootState) => state.chat);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadChats());
    }, [ dispatch ]);

    useEffect(() => {
        if (!activeChat && chats[0]) {
            dispatch(setActiveChat(chats[0].id));
        }
    }, [ dispatch, activeChat, chats ]);

    if (loadChatsStatus.loading) {
        return <span>Loading...</span>;
    }

    return (
        <React.Fragment>
            <h1>Chats</h1>
            <ul className="list-reset">
                {chats.map(chat => (
                    <li key={chat.id}>
                        <button
                            type="button"
                            className={`btn btn-100 ${(activeChat === chat.id) && 'btn-active'}`}
                            onClick={() => dispatch(setActiveChat(chat.id))}
                        >
                            {chat.name}
                        </button>
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
};
