import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
        },
        signInFailure: (state, action) => {
            state.loading = false;
        },
        signUpStart: (state) => {
            state.loading = true;
        },
        signUpSuccess: (state, action) => {
            state.loading = false;
        },
        signUpFailure: (state, action) => {
            state.loading = false;
        },
        uploadStart: (state) => {
            state.loading = true
        },
        uploadSuccess: (state, action) => {
            state.loading = false
        },
        uploadFailure: (state) => {
            state.loading = false
        },
        updateStart: (state) => {
            state.loading = true;
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
        },
        updateFailure: (state) => {
            state.loading = false;
        }
    }
});

export const { uploadStart, uploadSuccess, uploadFailure, updateStart, updateFailure, updateSuccess, signInStart, signInSuccess, signInFailure, signUpStart, signUpSuccess, signUpFailure } = userSlice.actions;

export default userSlice.reducer
