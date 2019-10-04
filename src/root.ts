import { combineReducers, Reducer, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { debugReducer } from 'modules/debug/duck';
import { messagesByChatIdReducer } from 'modules/message/duck';
import { enableBatching } from 'redux-batched-actions';

export const rootReducer = enableBatching(combineReducers({
    debug: debugReducer,
    recipient: messagesByChatIdReducer,
}));

type ExtractState<TReducer> = TReducer extends Reducer<infer S> ? S : never;

export type RootState = ExtractState<typeof rootReducer>;
export type RootDispatch = ThunkDispatch<RootState, {}, Action>;
