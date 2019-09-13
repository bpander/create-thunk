import { Reducer, AnyAction } from 'redux';

export interface Action<T, TPayload> {
    type: T;
    payload: TPayload;
}

export const configureActionsWith = <S>(initialState: S, prefix = '') => {
    const handlerMap: Record<string, (payload: any) => (state: S) => S> = {};

    const configureAction = <P>(type: string, reduce: (payload: P) => (state: S) => S) => {
        const prefixedType = prefix + '/' + type;
        handlerMap[prefixedType] = reduce;

        const actionCreator = (payload: P) => ({ type: prefixedType, payload });
        return actionCreator;
    };

    const reducer: Reducer<S, AnyAction> = (state = initialState, action) => {
        const handler = handlerMap[action.type];
        if (handler) {
            return handler(action.payload)(state);
        }
        return state;
    };

    const update = configureAction<Partial<S>>('UPDATE', updates => s => ({ ...s, ...updates }));

    return { configureAction, reducer, update };
};
