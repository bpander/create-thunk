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

export const createThunk = <F extends AnyFunction>(
    asyncFn: F,
    handleUpdate: (...args: Parameters<F>) => (status: ThunkStatus<Parameters<F>>, result?: ResolveType<ReturnType<F>>, error?: Error) => Action | void,
) => {
    return (...args: Parameters<F>) => async (dispatch: Dispatch) => {
        let status: ThunkStatus<Parameters<F>> = { ...initialThunkStatus, args, loading: true };
        const initialAction = handleUpdate(...args)(status);
        if (initialAction) {
            dispatch(initialAction);
        }
        try {
            const result = await asyncFn(...args);
            status = { ...status, loading: false, lastUpdate: Date.now() };
            const successAction = handleUpdate(...args)(status, result);
            if (successAction) {
                dispatch(successAction);
            }
            return status;
        } catch (error) {
            status = { ...status, loading: false, error };
            const errorAction = handleUpdate(...args)(status, undefined, error);
            if (errorAction) {
                dispatch(errorAction);
            }
            return status;
        }
    };
};

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
