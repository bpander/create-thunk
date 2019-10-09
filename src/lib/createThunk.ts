import { Action, Dispatch } from 'redux';
import { shallowEqual } from 'react-redux';

type AnyFunction = (...args: any[]) => Promise<any>;
export type ResolveType<TPromise> = TPromise extends Promise<infer T> ? T : never;

export interface ThunkStatus<TArgs = any[]> {
    loading: boolean;
    error: Error | null;
    lastUpdate: number;
    args: TArgs;
}

export const initialThunkStatus: ThunkStatus = {
    loading: false,
    error: null,
    lastUpdate: 0,
    args: [],
};

const asyncActionFactory = <TReturnType>(
    config: <F extends AnyFunction>(
        actions: {
            start: () => Action | void;
            done: (result: ResolveType<ReturnType<F>>) => Action | void;
            fail: (error: Error) => Action | void;
        },
        asyncFn: F,
        ...args: Parameters<F>
    ) => TReturnType,
) => {
    return <F extends AnyFunction>(
        asyncFn: F,
        handleUpdate: (...args: Parameters<F>) => (status: ThunkStatus<Parameters<F>>, result?: ResolveType<ReturnType<F>>, error?: Error) => Action | void,
    ) => (...args: Parameters<F>) => {
        let status: ThunkStatus<Parameters<F>> = { ...initialThunkStatus, args };
        const onUpdate = handleUpdate(...args);
        const start = () => {
            status = { ...status, loading: true };
            return onUpdate(status);
        };
        const done = (result: ResolveType<ReturnType<F>>) => {
            status = { ...status, loading: false, lastUpdate: Date.now() };
            return onUpdate(status, result);
        };
        const fail = (error: Error) => {
            status = { ...status, loading: false, error };
            return onUpdate(status, undefined, error);
        };
        return config({ start, done, fail }, asyncFn, ...args);
    };
};

export const createThunk = asyncActionFactory(({ start, done, fail }, effect, ...args) => {
    return async (dispatch: Dispatch) => {
        const startAction = start();
        startAction && dispatch(startAction);
        try {
            const result = await effect(...args);
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

export const shouldCall = <TArgs extends any[]>(options: { status: ThunkStatus<TArgs>; maxAge?: number }) => {
    return (...args: TArgs): boolean => {
        if (options.status.error) {
            return true;
        }
        if (!shallowEqual(args, options.status.args)) {
            return true;
        }
        if (options.status.loading) {
            return false;
        }
        if (options.maxAge && options.status.lastUpdate && Date.now() - options.status.lastUpdate > options.maxAge) {
            return true;
        }
        return false;
    };
};
