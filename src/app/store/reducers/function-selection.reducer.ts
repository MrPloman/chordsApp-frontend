import { Action, createReducer, on } from '@ngrx/store';
import { functionSelectionInitialState } from '../state/function-selection.state';
import {
  createProgressionAction,
  guessChordAction,
} from '../actions/function-selection.actions';

export const functionSelectedReducer = createReducer(
  functionSelectionInitialState,
  on(guessChordAction, (state) => {
    state.functionSelected = 'guesser';
    return state;
  }),
  on(createProgressionAction, (state) => {
    state.functionSelected = 'progression';
    return state;
  }),
  on(createProgressionAction, (state) => {
    state.functionSelected = undefined;
    return state;
  })
);
// export function reducer(state = functionSelectionInitialState, action: Action) {
//   return functionSelectedReducer(state, action);
// }
