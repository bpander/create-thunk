import { Reducer } from 'redux';

export interface Action<TPayload> {
    type: string;
    payload: TPayload;
}

type Reduce<S, P> = (payload: P) => (state: S) => S;

interface Slice<S> {
    reducer: Reducer<S>;
    configureAction: <P>(type: string, reduce: Reduce<S, P>) => (payload: P) => Action<P>;
    update: <K extends keyof S>(updates: Pick<S, K>) => Action<Pick<S, K>>;
}

interface SliceDictionary<S> {
    reducer: Reducer<Partial<{ [key: string]: S }>>;
    configureAction: <P>(type: string, reduce: Reduce<S, P>) => (key: string, payload: P) => Action<{ key: string; action: Action<P> }>;
    update: <K extends keyof S>(key: string, updates: Pick<S, K>) => Action<{ key: string; action: Action<Pick<S, K>> }>;
}

export const createSlice = <S>(initialState: S, prefix = ''): Slice<S> => {
    const handlerMap: Record<string, (payload: any) => (state: S) => S> = {};

    const configureAction: Slice<S>['configureAction'] = (type, reduce) => {
        const prefixedType = prefix + '/' + type;
        handlerMap[prefixedType] = reduce;    
        return payload => ({ type: prefixedType, payload });
    };

    const sliceManager: Slice<S> = {
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

export const createSliceDictionary = <S>(type: string, slice: Slice<S>): SliceDictionary<S> => {
    return {
        configureAction: (t, r) => {
            const innerAction = slice.configureAction(t, r);
            return (key, payload) => ({ type, payload: { key, action: innerAction(payload) } });
        },
        reducer: (state = {}, action) => {
            if (action.type === type) {
                const { key } = action.payload;
                return { ...state, [key]: slice.reducer(state[key], action.payload.action) };
            }
            return state;
        },
        update: (key, updates) => ({ type, payload: { key, action: slice.update(updates) } })
    };
};
