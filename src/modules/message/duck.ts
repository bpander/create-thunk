import { enableBatching } from 'redux-batched-actions';

import { configureActionsWith } from 'lib/configuredActions';
import { Message } from './types';
import { MessageService } from './MessageService';
import { createThunk, ThunkStatus, initialThunkStatus } from 'lib/createThunk';
import { omit } from 'lib/objects';

export interface MessageState {
    messages: Message[];
    loadAllStatus: ThunkStatus;
    sendStatuses: Record<string, ThunkStatus<[SendRequest]>>;
}

export const initialState: MessageState = {
    messages: [],
    loadAllStatus: initialThunkStatus,
    sendStatuses: {},
};

const { configureAction, reducer, update } = configureActionsWith(initialState, 'MESSAGE');
export const messageReducer = enableBatching(reducer);

const appendMessage = configureAction<Message>(
    'APPEND_MESSAGE',
    message => state => ({ ...state, messages: [ ...state.messages, message ] }),
);

export const loadAll = createThunk(
    MessageService.loadAll,
    messages => update({ messages }),
    loadAllStatus => update({ loadAllStatus }),
);

export interface SendRequest {
    tempId: string;
    text: string;
}

export const sendMessage = createThunk(
    (sendRequest: SendRequest) => MessageService.send(sendRequest.text),
    message => appendMessage(message),
    configureAction(
        'SEND_STATUS_CHANGE',
        sendStatus => state => {
            const { sendStatuses } = state;
            const [ sendRequest ] = sendStatus.args;
            if (!sendStatus.error && !sendStatus.loading) {
                return { ...state, sendStatuses: omit(sendStatuses, sendRequest.tempId) };
            }
            return { ...state, sendStatuses: { ...sendStatuses, [sendRequest.tempId]: sendStatus } };
        },
    ),
);

export const cancelMessage = configureAction<string>(
    'CANCEL_SEND_REQUEST',
    tempId => state => ({ ...state, sendStatuses: omit(state.sendStatuses, tempId) }),
);
