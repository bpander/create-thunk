import { createSlice, createSliceDictionary } from 'lib/configuredActions';
import { Message } from './types';
import { MessageService } from './MessageService';
import { createThunk, AsyncActionState, initialAsyncActionState } from 'lib/createThunk';
import { omit } from 'lib/objects';
import { batchActions } from 'redux-batched-actions';
import { Action } from 'redux';

export interface MessageState {
    messages: Message[];
    loadAllState: AsyncActionState;
    sendStates: Record<string, AsyncActionState<[SendRequest]>>;
}

export const initialMessageState: MessageState = {
    messages: [],
    loadAllState: initialAsyncActionState,
    sendStates: {},
};

const { configureAction, reducer, update } = createSliceDictionary('MESSAGES_BY_CHAT', createSlice(initialMessageState, 'MESSAGE'));
export const messageReducer = reducer;

export const messagesByChatIdReducer = messageReducer;

export const appendMessage = configureAction<Message>(
    'APPEND_MESSAGE',
    message => state => ({ ...state, messages: [ ...state.messages, message ] }),
);

export const cancelMessage = configureAction<string>(
    'CANCEL_SEND_REQUEST',
    tempId => state => ({ ...state, sendStates: omit(state.sendStates, tempId) }),
);

export const updateSendStates = configureAction<AsyncActionState<[SendRequest]>>(
    'UPDATE_SEND_STATES',
    sendState => state => {
        const { sendStates } = state;
        const [ sendRequest ] = sendState.args;
        if (!sendState.error && !sendState.loading) {
            return { ...state, sendStates: omit(sendStates, sendRequest.tempId) };
        }
        return { ...state, sendStates: { ...sendStates, [sendRequest.tempId]: sendState } };
    },
);

export const loadAll = createThunk(
    MessageService.loadAll,
    recipientId => (loadAllState, messages) => (messages)
        ? update(recipientId, { loadAllState, messages })
        : update(recipientId, { loadAllState }),
);

export interface SendRequest {
    tempId: string;
    recipientId: string;
    text: string;
}

export const sendMessage = createThunk(
    ({ recipientId, text }: SendRequest) => MessageService.send(recipientId, text),
    ({ recipientId }) => (sendState, message) => {
        const actions: Action[] = [ updateSendStates(recipientId, sendState) ];
        if (message) {
            actions.push(appendMessage(recipientId, message));
        }
        return batchActions(actions);
    },
);
