import { createReducer, on } from '@ngrx/store';
import { loadingStatus } from '../actions/loading.actions';
import { loadingInitialState } from '../state/loading.state';

export const loadingReducer = createReducer(
  loadingInitialState,
  on(loadingStatus, (state, props) => {
    return {
      loading: props.loading,
    };
  })
);
