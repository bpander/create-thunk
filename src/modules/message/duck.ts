import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { createReducer } from 'lib/createReducer';
import { Message } from './types';
import { MessageService } from './MessageService';
import { createThunk, ThunkStatus, initialThunkStatus } from 'lib/createThunk';

interface RootState { message: MessageState }
type MessageThunk<R> = ThunkAction<R, RootState, {}, Action>
const getSlice = (state: RootState): MessageState => state.message;

export interface MessageState {
  messages: Message[];
  loadAllStatus: ThunkStatus;
  sendStatuses: ThunkStatus[];
}

const initialState: MessageState = {
  messages: [],
  loadAllStatus: initialThunkStatus,
  sendStatuses: [],
};

const { reducer, update } = createReducer('message/UPDATE', initialState);
export const messageReducer = reducer;

const appendMessage = (message: Message): MessageThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    dispatch(update({ messages: [ ...getSlice(getState()).messages, message ]}));
  };
};

export const loadAll = createThunk(
  MessageService.loadAll,
  messages => update({ messages }),
  loadAllStatus => update({ loadAllStatus }),
);

export const sendMessage = createThunk(
  MessageService.send,
  message => appendMessage(message),
  
);
