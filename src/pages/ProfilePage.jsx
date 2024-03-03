import { useSelector } from 'react-redux';
import NavBar from '../features/nav/NavBar';
import Profile from '../features/user/components/Profile/Profile';
import { selectUser } from '../features/user/userSlice';
import { Box, CircularProgress } from '@mui/material';

function ProfilePage() {
    const user = useSelector(selectUser);
    return (
        <>
            {user ? (
                <>
                    <NavBar>
                        <Profile></Profile>
                    </NavBar>
                </>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}>
                    <CircularProgress />
                </Box>
            )}
        </>
    );
}

export default ProfilePage;
