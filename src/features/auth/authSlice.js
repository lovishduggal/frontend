import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../app/utils/axiosInstance';
const initialState = {
    isLoggedIn: null,
    jwt: null,
    userId: null,
};

export const signup = createAsyncThunk('auth/signup', async (data) => {
    try {
        const response = axiosInstance.post('/auth/signup', data);
        toast.promise(response, {
            loading: 'Signing up...',
            success: (response) => {
                return response?.data?.message;
            },
            error: 'Failed to sign up the user',
        });
        return (await response).data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

export const login = createAsyncThunk('auth/login', async (data) => {
    try {
        const response = axiosInstance.post('/auth/login', data);
        toast.promise(response, {
            loading: 'Logging...',
            success: (response) => {
                return response?.data?.message;
            },
            error: 'Failed to log in the user',
        });
        return (await response).data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

export const checkLoggedIn = createAsyncThunk(
    'auth/checkLoggedIn',
    async () => {
        try {
            const response = axiosInstance.get('/auth/check');
            toast.promise(response, {
                success:(response) => {
                    return response?.data?.message;
                },
                error: (error) => {
                    return error.response?.data?.message;
                },
            });
            return (await response).data;
        } catch (error) {
            return error.response.data;
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        const response = axiosInstance.get('/auth/logout');
        toast.promise(response, {
            loading: 'Logging out...',
            success: (response) => {
                return response?.data?.message;
            },
            error: 'Failed to logout the user',
        });
        return (await response).data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action?.payload?.success;
                state.jwt = action?.payload?.jwt;
                state.userId = action?.payload?.userId;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = null;
                state.userId = null;
                state.jwt = null;
            })
            .addCase(checkLoggedIn.fulfilled, (state, action) => {
                state.isLoggedIn = action?.payload?.success;
                state.jwt = action?.payload?.jwt;
                state.userId = action?.payload?.userId;
            });
    },
});

export const selectLoggedInUser = (state) => state.auth.isLoggedIn;
export const selectJwt = (state) => state.auth.jwt;
export const selectUserId = (state) => state.auth.userId;
export const { setUser } = authSlice.actions;
export default authSlice.reducer;
