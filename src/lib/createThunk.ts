import { Action, Dispatch } from 'redux';

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
    handleUpdate: (...args: Parameters<F>) => (status: ThunkStatus<Parameters<F>>, result?: ResolveType<ReturnType<F>>, error?: Error) => Action | undefined,
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
