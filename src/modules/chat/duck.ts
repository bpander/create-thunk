import { createSlice } from 'lib/configuredActions';
import { Chat } from './models/Chat';
import { createThunk, AsyncActionState, initialAsyncActionState } from 'lib/createThunk';
import { ChatService } from './ChatService';

interface ChatState {
    activeChat: string | null;
    chats: Chat[];
    loadChatsState: AsyncActionState;
}

const initialChatState: ChatState = {
    activeChat: null,
    chats: [],
    loadChatsState: initialAsyncActionState,
};

const { reducer, update, configureAction } = createSlice(initialChatState, 'CHAT');
export const chatReducer = reducer;

export const setActiveChat = configureAction<string>(
    'SET_ACTIVE_CHAT',
    activeChat => state => ({ ...state, activeChat }),
);

export const loadChats = createThunk(
    ChatService.loadAll,
    () => (loadChatsState, chats) => (chats)
        ? update({ loadChatsState, chats })
        : update({ loadChatsState }),
);
