import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@emotion/react';
import { themeSettings } from './theme.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LogInPage from './pages/LogInPage.jsx';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    checkLoggedIn,
    selectLoggedInUser,
    selectUserId,
} from './features/auth/authSlice.js';
import RequireAuth from './features/auth/components/RequireAuth.jsx';
import Home from './pages/Home.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import ProfilePage from './pages/ProfilePage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import { Box, createTheme } from '@mui/material';
import {
    getUserProfile,
    selectMode,
    setMode,
} from './features/user/userSlice.js';
import CreatePostPage from './pages/CreatePostPage.jsx';
import { getAllPost } from './features/post/postSlice.js';
import OtherUserProfilePage from './pages/OtherUserProfilePage.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <RequireAuth>
                <Home></Home>
            </RequireAuth>
        ),
    },
    {
        path: '/signup',
        element: <SignUpPage></SignUpPage>,
    },
    {
        path: '/login',
        element: <LogInPage></LogInPage>,
    },
    {
        path: '/profile',
        element: (
            <RequireAuth>
                <ProfilePage></ProfilePage>
            </RequireAuth>
        ),
    },
    {
        path: '/profile/:id',
        element: (
            <RequireAuth>
                <OtherUserProfilePage></OtherUserProfilePage>
            </RequireAuth>
        ),
    },
    {
        path: '/create-post',
        element: (
            <RequireAuth>
                {' '}
                <CreatePostPage></CreatePostPage>
            </RequireAuth>
        ),
    },

    {
        path: '/search',
        element: (
            <RequireAuth>
                <SearchPage></SearchPage>
            </RequireAuth>
        ),
    },
    {
        path: '/notifications',
        element: (
            <RequireAuth>
                <NotificationPage></NotificationPage>
            </RequireAuth>
        ),
    },
]);
function App() {
    const mode = useSelector(selectMode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectLoggedInUser);
    const userId = useSelector(selectUserId);

    useEffect(() => {
        const mode = localStorage.getItem('mode');
        dispatch(setMode({ mode }));
        (async () => {
            await dispatch(checkLoggedIn());
        })();
    }, []);

    useEffect(() => {
        if (isLoggedIn && userId) {
            dispatch(getAllPost());
            dispatch(getUserProfile({ userId }));
        }
    }, [isLoggedIn, dispatch, userId]);

    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <Box bgcolor={'background.default'} color={'text.primary'}>
                    <CssBaseline />
                    <RouterProvider router={router} />
                    <Toaster />
                </Box>
            </ThemeProvider>
        </div>
    );
}

export default App;
