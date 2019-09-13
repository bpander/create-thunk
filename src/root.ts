import { combineReducers, Reducer, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { debugReducer } from 'modules/debug/duck';
import { messageReducer } from 'modules/message/duck';

export const rootReducer = combineReducers({
  debug: debugReducer,
  message: messageReducer,
});

type ExtractState<TReducer> = TReducer extends Reducer<infer S> ? S : never;

export type RootState = ExtractState<typeof rootReducer>;
export type RootDispatch = ThunkDispatch<RootState, {}, Action>;
