import { useSelector } from 'react-redux';
import NavBar from '../features/nav/NavBar';
import Profile from '../features/user/components/Profile/Profile';
import { selectUserStatus } from '../features/user/userSlice';
import { CircularProgress, Stack, Toolbar } from '@mui/material';

function ProfilePage() {
    const userStatus = useSelector(selectUserStatus);
    return (
        <NavBar>
            {userStatus === 'loading' ? (
                <Stack alignItems={'center'}>
                    <Toolbar />
                    <CircularProgress variant="indeterminate" />
                </Stack>
            ) : (
                <Profile></Profile>
            )}
        </NavBar>
    );
}

export default ProfilePage;
