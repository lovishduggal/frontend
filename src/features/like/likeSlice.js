import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../app/utils/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    likes: [],
};

export const getAllLikes = createAsyncThunk(
    'like/getAllLikes',
    async (data) => {
        const { postId } = data;
        try {
            const response = await axiosInstance.get(`/like/${postId}`);
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
);

export const likePost = createAsyncThunk('like/likePost', async (data) => {
    const { postId } = data;
    try {
        const response = await axiosInstance.post(`/like/${postId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

export const unLikePost = createAsyncThunk('like/unLikePost', async (data) => {
    const { postId } = data;
    try {
        const response = await axiosInstance.delete(`/like/${postId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});
const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {
        setLikes: (state) => {
            state.likes = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllLikes.fulfilled, (state, action) => {
            state.likes = action.payload.likes;
        });
    },
});

export const selectLikes = (state) => state.like.likes;
export const { setLikes } = likeSlice.actions;
export default likeSlice.reducer;
