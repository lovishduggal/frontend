import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../authSlice';

function RequireAuth({ children }) {
    const isLoggedIn = useSelector(selectLoggedInUser);
    switch (isLoggedIn) {
        case true:
            return children;
        case false:
            return <Navigate to="/login" replace={true} />;
        default:
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}>
                    <CircularProgress />
                </Box>
            );
    }
}

export default RequireAuth;
