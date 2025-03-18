import { Action, createReducer, on, props } from '@ngrx/store';
import { functionSelectionInitialState } from '../state/function-selection.state';
import {
  resetSelectionAction,
  selectOptionAction,
} from '../actions/function-selection.actions';

export const functionSelectedReducer = createReducer(
  functionSelectionInitialState,
  on(selectOptionAction, (state, props) => {
    return { ...state, functionSelected: props.option };
  }),

  on(resetSelectionAction, (state) => {
    state.functionSelected = undefined;
    return state;
  })
);
export function reducer(state = functionSelectionInitialState, action: Action) {
  return functionSelectedReducer(state, action);
}
