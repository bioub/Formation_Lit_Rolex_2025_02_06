import { createReducer } from '@reduxjs/toolkit';

import { fetchUsers, updateFilter, updateTitle } from './actions';

const initialState = {
  title: 'My App',
  users: {
    data: [],
    status: 'idle',
    error: '',
    filter: '',
  },
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(updateTitle, (state, action) => {
      state.title = action.payload;
    })
    .addCase(updateFilter, (state, action) => {
      state.users.filter = action.payload;
    })
    .addCase(fetchUsers.fulfilled, (state, action) => {
      state.users.data = action.payload;
      state.users.status = 'success';
    })
    .addCase(fetchUsers.pending, (state, action) => {
      state.users.status = 'pending';
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.users.status = 'error';
      state.users.error = action.error.message;
    });
});
