import { createSlice } from 'lib/configuredActions';
import { Chat } from './models/Chat';
import { createThunk, ThunkStatus, initialThunkStatus } from 'lib/createThunk';
import { ChatService } from './ChatService';

interface ChatState {
    activeChat: string | null;
    chats: Chat[];
    loadChatsStatus: ThunkStatus;
}

const initialChatState: ChatState = {
    activeChat: null,
    chats: [],
    loadChatsStatus: initialThunkStatus,
};

const { reducer, update, configureAction } = createSlice(initialChatState, 'CHAT');
export const chatReducer = reducer;

export const setActiveChat = configureAction<string>(
    'SET_ACTIVE_CHAT',
    activeChat => state => ({ ...state, activeChat }),
);

export const loadChats = createThunk(
    ChatService.loadAll,
    () => (loadChatsStatus, chats) => (chats)
        ? update({ loadChatsStatus, chats })
        : update({ loadChatsStatus }),
);
