import { functionType } from '@app/types/index.types';

export interface IFunctionSelectionState {
  option: undefined | functionType;
}

export const functionSelectionInitialState: IFunctionSelectionState = {
  option: undefined,
};
