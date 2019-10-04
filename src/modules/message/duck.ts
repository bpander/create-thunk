import { configureActionsWith } from 'lib/configuredActions';
import { Message } from './types';
import { MessageService } from './MessageService';
import { createThunk, ThunkStatus, initialThunkStatus } from 'lib/createThunk';
import { omit } from 'lib/objects';
import { wrap, wrapReducer } from 'lib/keyedSubStates';

export interface MessageState {
    messages: Message[];
    loadAllStatus: ThunkStatus;
    sendStatuses: Record<string, ThunkStatus<[SendRequest]>>;
}

export const initialMessageState: MessageState = {
    messages: [],
    loadAllStatus: initialThunkStatus,
    sendStatuses: {},
};

const { configureAction, reducer, update } = configureActionsWith(initialMessageState, 'MESSAGE');
export const messageReducer = reducer;

export const messagesByChatIdReducer = wrapReducer(messageReducer);

export const appendMessage = configureAction<Message>(
    'APPEND_MESSAGE',
    message => state => ({ ...state, messages: [ ...state.messages, message ] }),
);

export const cancelMessage = configureAction<string>(
    'CANCEL_SEND_REQUEST',
    tempId => state => ({ ...state, sendStatuses: omit(state.sendStatuses, tempId) }),
);

export const loadAll = createThunk(
    MessageService.loadAll,
    (messages, [ recipientId ]) => wrap(recipientId, update({ messages })),
    (loadAllStatus, [ recipientId ]) => wrap(recipientId, update({ loadAllStatus })),
);

export interface SendRequest {
    tempId: string;
    recipientId: string;
    text: string;
}

const updateSendStatuses = configureAction<ThunkStatus<[SendRequest]>>(
    'UPDATE_SEND_STATUSES',
    sendStatus => state => {
        const { sendStatuses } = state;
        const [ sendRequest ] = sendStatus.args;
        if (!sendStatus.error && !sendStatus.loading) {
            return { ...state, sendStatuses: omit(sendStatuses, sendRequest.tempId) };
        }
        return { ...state, sendStatuses: { ...sendStatuses, [sendRequest.tempId]: sendStatus } };
    },
);

export const sendMessage = createThunk(
    ({ recipientId, text }: SendRequest) => MessageService.send(recipientId, text),
    (message, [ { recipientId } ]) => wrap(recipientId, appendMessage(message)),
    (status, [ { recipientId } ]) => wrap(recipientId, updateSendStatuses(status)),
);
