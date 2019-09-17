import { combineReducers, Reducer, Action } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { debugReducer } from 'modules/debug/duck';
import { messageReducer, MessageState } from 'modules/message/duck';

interface RecipientState {
    [recipientId: string]: MessageState;
}

const recipientReducer: Reducer<RecipientState> = (state = {}, action) => {
    if (action.type === 'KEYED_ACTION') {
        const { key } = action.payload;
        return { ...state, [key]: messageReducer(state[key], action.payload.action) }
    }
    return state;
};

export const wrap = <R, S, E, A extends Action>(key: string, action: Action | ThunkAction<R, S, E, A>) => {
    if (typeof action === 'function') {
        const thunk = (originalDispatch: any, getState: () => S, e: E) => {
            const dispatch = (asyncAction: any) => {
                if (typeof asyncAction === 'function') {
                    return asyncAction(dispatch, getState, e);
                }
                return originalDispatch(wrap(key, asyncAction));
            };
            return action(dispatch, getState, e);
        };
        return thunk;
    }
    return { type: 'KEYED_ACTION', payload: { key, action } };
};

export const rootReducer = combineReducers({
    debug: debugReducer,
    message: messageReducer,
    recipient: recipientReducer,
});

type ExtractState<TReducer> = TReducer extends Reducer<infer S> ? S : never;

export type RootState = ExtractState<typeof rootReducer>;
export type RootDispatch = ThunkDispatch<RootState, {}, Action>;
