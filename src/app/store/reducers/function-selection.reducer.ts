import { Action, createReducer, on, props } from '@ngrx/store';
import { functionSelectionInitialState } from '../state/function-selection.state';
import {
  resetSelectionAction,
  selectOptionAction,
} from '../actions/function-selection.actions';

export const functionSelectedReducer = createReducer(
  functionSelectionInitialState,
  on(selectOptionAction, (state, props) => {
    const option = props.option;
    return { option: option };
  }),

  on(resetSelectionAction, (state) => {
    state.option = undefined;
    return state;
  })
);
