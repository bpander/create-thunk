import { enableBatching } from 'redux-batched-actions';

import { configureActionsWith } from 'lib/configuredActions';
import { Message } from './types';
import { MessageService } from './MessageService';
import { createThunk, ThunkStatus, initialThunkStatus } from 'lib/createThunk';

export interface MessageState {
    messages: Message[];
    loadAllStatus: ThunkStatus;
    sendStatuses: ThunkStatus[];
}

export const initialState: MessageState = {
    messages: [],
    loadAllStatus: initialThunkStatus,
    sendStatuses: [],
};

const { configureAction, reducer } = configureActionsWith(initialState, 'MESSAGE');
export const messageReducer = enableBatching(reducer);

const update = configureAction<Partial<MessageState>>(
    'UPDATE', updates => state => ({ ...state, ...updates }),
);

const appendMessage = configureAction<Message>(
    'APPEND_MESSAGE',
    message => state => ({ ...state, messages: [ ...state.messages, message ] }),
);

export const loadAll = createThunk(
    MessageService.loadAll,
    messages => update({ messages }),
    loadAllStatus => update({ loadAllStatus }),
);

export const sendMessage = createThunk(
    MessageService.send,
    message => appendMessage(message),
);
