import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalLiquidity: 2840950,
  frozenFunds: 412000,
  platformFees: 84200,
  transactions: [],
  loading: false,
};

const financialSlice = createSlice({
  name: 'financials',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTransactions, setLoading } = financialSlice.actions;
export default financialSlice.reducer;
