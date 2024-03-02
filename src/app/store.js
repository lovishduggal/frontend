import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import postReducer from '../features/post/postSlice';
import commentReducer from '../features/comment/commentSlice';
import likeReducer from '../features/like/likeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        post: postReducer,
        comment: commentReducer,
        like: likeReducer,
    },
});
