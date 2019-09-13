import React from 'react';
import { DebugState, update } from '../duck';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from 'root';

interface DebugMenuProps {
    debug: DebugState;
    update: (updates: Partial<DebugState>) => void;
}
const DebugMenu: React.FC<DebugMenuProps> = props => {
    return (
        <div style={{ background: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: 10 }}>
            <h3 style={{ marginTop: 0 }}>Debug menu</h3>
            <div>
                <label>
                    Latency
                    <input
                        type="number"
                        value={props.debug.latency}
                        onChange={e => props.update({ latency: Number(e.currentTarget.value) })}
                    />
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={props.debug.shouldRequestsFail}
                        onChange={e => props.update({ shouldRequestsFail: e.currentTarget.checked })}
                    />
                    Make api requests fail
                </label>
            </div>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    debug: state.debug,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ update }, dispatch);

export const DebugMenuContainer = connect(mapStateToProps, mapDispatchToProps)(DebugMenu);
