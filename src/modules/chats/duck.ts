import { configureActionsWith } from 'lib/configuredActions';

interface Chat {
    id: string;
    name: string;
}

interface ChatState {
    activeChat: string;
    chats: Chat[];
}

const initialChatState: ChatState = {
    activeChat: 'lkj',
    chats: [],
}

const { reducer } = configureActionsWith(initialChatState, 'CHAT');
export const chatReducer = reducer;
