import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  totalParticipants: 14208,
  selectedUser: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUsers, setSelectedUser, clearSelectedUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
