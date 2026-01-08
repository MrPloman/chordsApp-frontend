import { selectedModeType } from '@app/types/index.types';

export interface IFunctionSelectionState {
  option: undefined | selectedModeType;
}

export const functionSelectionInitialState: IFunctionSelectionState = {
  option: undefined,
};
