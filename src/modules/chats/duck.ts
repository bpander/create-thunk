import { createSlice } from 'lib/configuredActions';

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

const { reducer } = createSlice(initialChatState, 'CHAT');
export const chatReducer = reducer;
