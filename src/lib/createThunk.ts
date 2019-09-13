import { Action, Dispatch } from 'redux';
import { batchActions } from 'redux-batched-actions';

type AnyFunction = (...args: any[]) => Promise<any>;
export type ResolveType<TPromise> = TPromise extends Promise<infer T> ? T : never;

export interface ThunkStatus {
  loading: boolean;
  error: Error | null;
  lastUpdate: number;
  args: any[];
}

export const initialThunkStatus: ThunkStatus = {
  loading: false,
  error: null,
  lastUpdate: 0,
  args: [],
};

export const createThunk = <F extends AnyFunction, S, E>(
  asyncFn: F,
  successAction: (result: ResolveType<ReturnType<F>>) => Action,
  statusAction?: (status: ThunkStatus) => Action,
) => {
  return (...args: Parameters<F>) => async (dispatch: Dispatch) => {
    if (statusAction) {
      dispatch(statusAction({ ...initialThunkStatus, args, loading: true }));
    }
    try {
      const result = await asyncFn(...args);
      const successStatus: ThunkStatus = { args, loading: false, error: null, lastUpdate: Date.now() };
      if (statusAction) {
        dispatch(batchActions([ successAction(result), statusAction(successStatus) ]));
      } else {
        dispatch(successAction(result));
      }
      return successStatus;
    } catch (error) {
      const errorStatus: ThunkStatus = { ...initialThunkStatus, args, error };
      if (statusAction) {
        dispatch(statusAction(errorStatus));
      }
      return errorStatus;
    }
  };
};



// const { update, reducer } = createReducer('thing/UPDATE', initialState);
// export const thingReducer = reducer;

// const getSlice = (rootState: any): ThingState => rootState.thing;

// const fetchThingVanilla = (thingId: string): ThunkAction<void, {}, {}, AnyAction> => async (dispatch, getState) => {
//   dispatch(update({ fetchThingState: { ...getSlice(getState()).fetchThingState, status: 'pending' } }));
//   try {
//     const thing = await ThingService.fetch(thingId);
//     dispatch(update({
//       fetchThingState: { status: 'resolved', timestamp: Date.now() },
//       cache: { ...getSlice(getState()).cache, [thing.id]: thing },
//     }));
//   } catch (error) {
//     dispatch(update({ fetchThingState: { status: 'rejected', error } }));
//   }
// };

// const updateInCache = (thing: Thing) => (dispatch, getState) => {
//   dispatch(update({ cache: { ...getSlice(getState()).cache, [thing.id]: thing } }));
// };

// export const fetchThing = createThunk(
//   ThingService.fetch,
//   thing => updateInCache(thing),
//   fetchThingState => update({ fetchThingState }), /* optional */
// );

// export const updateThing = createThunk(ThingService.update, updateInCache);

// // export const fetchThingIfNeeded = memoizeThunk(fetchThing, state => {
// //   const thingState = getSlice(state);
// //   if (thingState.fetchThingState.status === 'rejected') {
// //     return true;
// //   }
// //   if (!isEqual(args, thingState.fetchThingState.args)) {
// //     return true;
// //   }
// //   if (thingState.fetchThingState.status === 'pending') {
// //     return false;
// //   }
// //   return maxAge(thingState.fetchThingState, 1000 * 60 * 60);
// // });

// export const fetchThingIfNeeded = (thingId: string) => (dispatch, getState) => {
//   if (shouldFetch(getSlice(getState()).fetchThingState, { maxAge: 1000 * 60 * 60 })) {
//     dispatch(fetchThing(thingId));
//   }
// };

// export const fetchThingIfNeeded = memoizeThunk(
//   fetchThing,
//   state => getSlice(state).fetchThingState,
//   1000 * 60 * 60, /* optional */
// );