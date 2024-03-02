import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../app/utils/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    mode: 'light',
    user: null,
    otherUser: null,
    notifications: [],
    status: 'idle',
};

export const getUserProfile = createAsyncThunk(
    'post/getUserProfile',
    async (data) => {
        const { userId } = data;
        try {
            const response = await axiosInstance.get(`/user/${userId}`);
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
);

export const getUserNotifications = createAsyncThunk(
    'post/getUserNotifications',
    async (data) => {
        const { userId } = data;
        try {
            const response = await axiosInstance.get(
                `/user/notifications/${userId}`
            );
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'post/updateUserProfile',
    async (data) => {
        try {
            const response = axiosInstance.put(`/user/me`, data);
            toast.promise(response, {
                loading: 'Updating profile...',
                success: (response) => {
                    return response.data.message;
                },
                error: 'Failed to update the profile',
            });
            return (await response).data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
);

export const getUserProfileOfOtherUser = createAsyncThunk(
    'post/getUserProfileOfOtherUser',
    async (data) => {
        const { otherUserId } = data;
        try {
            const response = await axiosInstance.get(`/user/${otherUserId}`);
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
);

export const follow = createAsyncThunk('post/follow', async (data) => {
    const { otherUserId } = data;
    try {
        const response = await axiosInstance.post(
            `/user/follow/${otherUserId}`
        );
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

export const unFollow = createAsyncThunk('post/follow', async (data) => {
    const { otherUserId } = data;
    try {
        const response = await axiosInstance.post(
            `/user/unfollow/${otherUserId}`
        );
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setMode: (state, action) => {
            if (!(state.mode === action.payload.mode)) {
                state.mode = state.mode === 'light' ? 'dark' : 'light';
                localStorage.setItem('mode', state.mode);
            }
        },
        setOtherUser: (state) => {
            state.otherUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = action?.payload?.user;
            })
            .addCase(getUserNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserNotifications.fulfilled, (state, action) => {
                state.status = 'idle';
                state.notifications = action.payload.notifications;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = action.payload.user;
            })
            .addCase(getUserProfileOfOtherUser.fulfilled, (state, action) => {
                state.otherUser = action.payload.user;
            });
    },
});

export const selectMode = (state) => state.user.mode;
export const selectUser = (state) => state.user.user;
export const selectOtherUser = (state) => state.user.otherUser;
export const selectUserStatus = (state) => state.user.status;
export const selectUserNotifications = (state) => state.user.notifications;
export const { setMode, setOtherUser } = userSlice.actions;
export default userSlice.reducer;
