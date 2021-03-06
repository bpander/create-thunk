import { createSlice } from 'lib/configuredActions';

export interface DebugState {
    latency: number;
    shouldRequestsFail: boolean;
}

const initialState: DebugState = {
    latency: 500,
    shouldRequestsFail: false,
};

const { reducer, update } = createSlice(initialState, 'DEBUG');
export const debugReducer = reducer;

export { update };
