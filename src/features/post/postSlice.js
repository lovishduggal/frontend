import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../app/utils/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    posts: [],
    status: 'idle',
};
export const getAllPost = createAsyncThunk('post/getAllPosts', async () => {
    try {
        const response = await axiosInstance.get('/post');
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

export const uploadPost = createAsyncThunk('post/uploadPost', async (data) => {
    try {
        const response = axiosInstance.post(`/post`, data);
        toast.promise(response, {
            loading: 'Uploading...',
            success: (response) => {
                return response?.data?.message;
            },
            error: 'Failed to upload the post',
        });
        return (await response).data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

export const updatePost = createAsyncThunk('post/updatePost', async (data) => {
    const { content, postId } = data;
    try {
        const response = axiosInstance.put(`/post/${postId}`, {
            content,
        });
        toast.promise(response, {
            loading: 'Updating...',
            success: (response) => {
                return response?.data?.message;
            },
            error: 'Failed to update the post',
        });
        return (await response).data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

export const deletePost = createAsyncThunk('post/deletePost', async (data) => {
    const { postId } = data;
    try {
        const response = axiosInstance.delete(`/post/${postId}`);
        toast.promise(response, {
            loading: 'Deleting...',
            success: (response) => {
                return response?.data?.message;
            },
            error: 'Failed to delete the post',
        });
        return (await response).data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllPost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllPost.fulfilled, (state, action) => {
                state.status = 'idle';
                state.posts = action.payload.posts;
            })
            .addCase(uploadPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload.newPost);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex(
                    (post) => post._id === action.payload.updatedPost._id
                );
                state.posts[index] = action.payload.updatedPost;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex(
                    (post) => post._id === action.payload.deletedPost._id
                );
                state.posts.splice(index, 1);
            });
    },
});

export const selectPosts = (state) => state.post.posts;
export const selectPostStatus = (state) => state.post.status;
export default postSlice.reducer;
