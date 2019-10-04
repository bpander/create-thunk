import { Action, Reducer } from 'redux';

export const KEYED_ACTION = 'KEYED_ACTION';

export const wrapReducer = <T>(reducer: Reducer<T>) => {
  const wrappedReducer: Reducer<Partial<{ [key: string]: T }>> = (state = {}, action) => {
    if (action.type === KEYED_ACTION) {
      const { key } = action.payload;
      return { ...state, [key]: reducer(state[key], action.payload.action) };
    }
    return state;
  }
  return wrappedReducer;
};

export const wrap = (key: string, action: Action) => {
  return { type: 'KEYED_ACTION', payload: { key, action } };
};
