import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

export const updateTitle = createAction('updateTitle');
export const updateFilter = createAction('updateFilter');
export const fetchUsers = createAsyncThunk('fetchUsers', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return response.json();
});
