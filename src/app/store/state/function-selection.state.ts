interface IFunctionSelectionState {
  functionSelected: undefined | 'guesser' | 'progression';
}

export const functionSelectionInitialState: IFunctionSelectionState = {
  functionSelected: undefined,
};
