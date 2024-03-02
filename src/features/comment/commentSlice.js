import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../app/utils/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    comments: [],
    status: 'idle',
};
export const getAllComments = createAsyncThunk(
    'comment/getAllComments',
    async (data) => {
        const { postId } = data;
        try {
            const response = await axiosInstance.get(`/comment/${postId}`);
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
);

export const createComment = createAsyncThunk(
    'comment/createComment',
    async (data) => {
        const { content, postId } = data;
        try {
            const response = axiosInstance.post(`/comment/${postId}`, {
                content,
            });
            toast.promise(response, {
                loading: 'Posting comment...',
                success: (response) => {
                    return response.data.message;
                },
                error: 'Failed to post the comment',
            });
            return (await response).data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
);

export const deleteComment = createAsyncThunk(
    'comment/deleteComment',
    async (data) => {
        const { postId, commentId } = data;
        try {
            const response = axiosInstance.delete(
                `/comment/${postId}/${commentId}`
            );
            toast.promise(response, {
                loading: 'Deleting comment...',
                success: (response) => {
                    return response.data.message;
                },
                error: 'Failed to delete the comment',
            });
            return (await response).data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
);
const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setComments: (state) => {
            state.comments = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllComments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.status = 'Idle';
                state.comments = action.payload.comments;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(
                    (comment) =>
                        comment._id === action.payload.deletedComment._id
                );
                state.comments.splice(index, 1);
            });
    },
});

export const selectComments = (state) => state.comment.comments;
export const selectCommentStatus = (state) => state.comment.status;
export const { setComments } = commentSlice.actions;
export default commentSlice.reducer;
