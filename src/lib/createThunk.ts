import { Action, Dispatch } from 'redux';
import { shallowEqual } from 'react-redux';

type AsyncFunction = (...args: any[]) => Promise<any>;
export type ResolveType<TPromise> = TPromise extends Promise<infer T> ? T : never;

export interface AsyncActionState<TArgs = any[]> {
    loading: boolean;
    error: Error | null;
    lastUpdate: number;
    args: TArgs;
}

export const initialAsyncActionState: AsyncActionState = {
    loading: false,
    error: null,
    lastUpdate: 0,
    args: [],
};

export const asyncActionFactory = <TReturnType>(
    config: <F extends AsyncFunction>(
        actions: {
            start: () => Action | void;
            done: (result: ResolveType<ReturnType<F>>) => Action | void;
            fail: (error: Error) => Action | void;
        },
        asyncFn: F,
        ...args: Parameters<F>
    ) => TReturnType,
) => {
    return <F extends AsyncFunction>(
        asyncFn: F,
        handleUpdate: (...args: Parameters<F>) => (
            state: AsyncActionState<Parameters<F>>,
            result?: ResolveType<ReturnType<F>>,
            error?: Error,
        ) => Action | void,
    ) => (...args: Parameters<F>) => {
        let state: AsyncActionState<Parameters<F>> = { ...initialAsyncActionState, args };
        const onUpdate = handleUpdate(...args);
        const start = () => {
            state = { ...state, loading: true };
            return onUpdate(state);
        };
        const done = (result: ResolveType<ReturnType<F>>) => {
            state = { ...state, loading: false, lastUpdate: Date.now() };
            return onUpdate(state, result);
        };
        const fail = (error: Error) => {
            state = { ...state, loading: false, error };
            return onUpdate(state, undefined, error);
        };
        return config({ start, done, fail }, asyncFn, ...args);
    };
};

export const createThunk = asyncActionFactory(({ start, done, fail }, asyncFn, ...args) => {
    return async (dispatch: Dispatch) => {
        const startAction = start();
        startAction && dispatch(startAction);
        try {
            const result = await asyncFn(...args);
            const doneAction = done(result);
            doneAction && dispatch(doneAction);
        } catch (e) {
            const failAction = fail(e);
            failAction && dispatch(failAction);
        }
    };
});

type Thunk = (...args: any[]) => (dispatch: Dispatch) => Promise<any>;
const noopThunk: Thunk = () => async () => {};

export const memoizeThunk = <T extends Thunk>(asyncFn: T, shouldCall: (...args: Parameters<T>) => boolean) => {
    return (...args: Parameters<T>) => {
        if (shouldCall(...args)) {
            return asyncFn(...args);
        }
        return noopThunk;
    }
};

export const isStale = <TArgs extends any[]>(options: { state: AsyncActionState<TArgs>; maxAge?: number }) => {
    return (...args: TArgs): boolean => {
        if (options.state.error) {
            return true;
        }
        if (!shallowEqual(args, options.state.args)) {
            return true;
        }
        if (options.state.loading) {
            return false;
        }
        if (!options.state.lastUpdate) {
            return true;
        }
        if (options.maxAge && options.state.lastUpdate && Date.now() - options.state.lastUpdate > options.maxAge) {
            return true;
        }
        return false;
    };
};
