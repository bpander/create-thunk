import { combineReducers, Reducer, Action } from 'redux';
import { messageReducer } from 'modules/message/duck';
import { ThunkDispatch } from 'redux-thunk';

export const rootReducer = combineReducers({
  message: messageReducer,
});

type ExtractState<TReducer> = TReducer extends Reducer<infer S> ? S : never;

export type RootState = ExtractState<typeof rootReducer>;
export type RootDispatch = ThunkDispatch<RootState, {}, Action>;
