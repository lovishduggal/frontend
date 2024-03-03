import {
    Avatar,
    CircularProgress,
    Link,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getUserNotifications,
    getUserProfile,
    selectNotificationStatus,
    selectUserNotifications,
    setOtherUser,
} from '../userSlice';
import { selectUserId } from '../../auth/authSlice';
import { Link as RouterLink } from 'react-router-dom';

function Notification() {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const notificationStatus = useSelector(selectNotificationStatus);
    const userNotifications = useSelector(selectUserNotifications);
    useEffect(() => {
        if (userId) {
            (async () => {
                await dispatch(getUserNotifications({ userId }));
                dispatch(setOtherUser({}));
                dispatch(getUserProfile({ userId }));
            })();
        }
    }, []);
    return (
        <Stack
            alignItems={'center'}
            sx={{ width: 1, height: 'calc(100vh - 64px)' }}>
            <Stack>
                {notificationStatus === 'loading' ? (
                    <>
                        <Toolbar />
                        <CircularProgress variant="indeterminate" />
                    </>
                ) : userNotifications.length > 0 ? (
                    userNotifications.map((notification) => (
                        <Link
                            underline="none"
                            to={`/profile/${notification?.user?._id}`}
                            component={RouterLink}
                            sx={{
                                marginY: 1,
                                bgcolor: `${
                                    notification?.saw
                                        ? 'none'
                                        : 'secondary.main'
                                }`,
                                padding: 1,
                                borderRadius: 2,
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            key={notification._id}>
                            <Avatar
                                alt={notification?.user?.fullName}
                                src={notification?.user?.profilePicture?.url}
                                sx={{
                                    bgcolor: 'text.primary',
                                    width: 56,
                                    height: 56,
                                    border: 2,
                                    borderColor: '#E43D90',
                                    marginRight: 2,
                                }}>
                                {' '}
                                {notification?.fullName &&
                                    notification.fullName[0]}
                            </Avatar>
                            <Typography variant="body1" color="text.primary">
                                {notification?.user?.fullName}{' '}
                                {notification?.action}
                            </Typography>
                        </Link>
                    ))
                ) : (
                    <Typography>
                        You don&#39;t have any notifications
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
}

export default Notification;
