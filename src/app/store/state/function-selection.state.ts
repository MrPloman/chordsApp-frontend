export interface IFunctionSelectionState {
  option: undefined | 'guesser' | 'progression' | 'options';
}

export const functionSelectionInitialState: IFunctionSelectionState = {
  option: undefined,
};
