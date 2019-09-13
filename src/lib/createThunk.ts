import { Action, Dispatch } from 'redux';
import { batchActions } from 'redux-batched-actions';

type AnyFunction = (...args: any[]) => Promise<any>;
export type ResolveType<TPromise> = TPromise extends Promise<infer T> ? T : never;

export interface ThunkStatus<TArgs = any[]> {
    id: string;
    loading: boolean;
    error: Error | null;
    lastUpdate: number;
    args: TArgs;
}

let counter = 0;
const uniqueId = () => {
    counter++;
    return String(counter);
};

export const initialThunkStatus: ThunkStatus = {
    id: '',
    loading: false,
    error: null,
    lastUpdate: 0,
    args: [],
};

export const createThunk = <F extends AnyFunction>(
    asyncFn: F,
    successAction: (result: ResolveType<ReturnType<F>>) => Action,
    statusAction?: (status: ThunkStatus<Parameters<F>>) => Action,
) => {
    return (...args: Parameters<F>) => async (dispatch: Dispatch) => {
        let status: ThunkStatus<Parameters<F>> = {
            ...initialThunkStatus, args, loading: true, id: uniqueId(),
        };
        if (statusAction) {
            dispatch(statusAction(status));
        }
        try {
            const result = await asyncFn(...args);
            status = { ...status, loading: false, lastUpdate: Date.now() };
            if (statusAction) {
                dispatch(batchActions([ successAction(result), statusAction(status) ]));
            } else {
                dispatch(successAction(result));
            }
            return status;
        } catch (error) {
            status = { ...status, loading: false, error };
            if (statusAction) {
                dispatch(statusAction(status));
            }
            return status;
        }
    };
};
