import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { createReducer } from 'lib/createReducer';
import { Message } from './types';
import { MessageService } from './MessageService';

interface MessageState {
  messages: Message[];
}

interface State {
  message: MessageState;
}

type MessageThunk<R> = ThunkAction<R, State, {}, Action>

const getSlice = (state: State): MessageState => state.message;

const initialState: MessageState = {
  messages: [],
};

const { reducer, update } = createReducer('message/UPDATE', initialState);
export const messageReducer = reducer;

export const sendMessage = (text: string): MessageThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    const message = await MessageService.send(text);
    dispatch(update({ messages: [ ...getSlice(getState()).messages, message ]}));
  };
};
