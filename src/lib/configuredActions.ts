import { Reducer, AnyAction } from 'redux';

export interface Action<TPayload> {
    type: string;
    payload: TPayload;
}

type ActionCreator<P> = (payload: P) => Action<P>;

type Reduce<S, P> = (payload: P) => (state: S) => S;

interface SliceManager<S> {
    reducer: Reducer<S>;
    configureAction: <P>(type: string, reduce: Reduce<S, P>) => ActionCreator<P>;
    update: <K extends keyof S>(updates: Pick<S, K>) => Action<Pick<S, K>>;
}

export const configureActionsWith = <S>(initialState: S, prefix = ''): SliceManager<S> => {
    const handlerMap: Record<string, (payload: any) => (state: S) => S> = {};

    const configureAction: SliceManager<S>['configureAction'] = (type, reduce) => {
        const prefixedType = prefix + '/' + type;
        handlerMap[prefixedType] = reduce;    
        return payload => ({ type: prefixedType, payload });
    };

    const sliceManager: SliceManager<S> = {
        configureAction,
        reducer: (state = initialState, action) => {
            const handler = handlerMap[action.type];
            if (handler) {
                return handler(action.payload)(state);
            }
            return state;
        },
        update: configureAction('UPDATE', updates => state => ({ ...state, ...updates })),
    };

    return sliceManager;
};
