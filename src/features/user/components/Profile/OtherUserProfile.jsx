import {
    Avatar,
    Box,
    Button,
    Stack,
    Typography,
    Link,
    CircularProgress,
} from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    follow,
    getUserProfile,
    getUserProfileOfOtherUser,
    selectOtherUser,
    setOtherUser,
    unFollow,
} from '../../userSlice';
import { AlternateEmail } from '@mui/icons-material';
import { selectUserId } from '../../../auth/authSlice';
import ViewPhoto from '../../../common/ViewPhoto';

function ImagesList({ otherUser }) {
    const [open, setOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            {otherUser &&
                otherUser?.posts?.length > 0 &&
                otherUser.posts.map((post) => (
                    <ImageListItem
                        sx={{ width: 300, cursor: 'pointer' }}
                        key={post._id}
                        onClick={() => {
                            setModalData(post);
                            handleClickOpen();
                        }}>
                        <img
                            srcSet={`${post?.image?.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            src={`${post?.image?.url}?w=164&h=164&fit=crop&auto=format`}
                            alt={post?.content}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            <ViewPhoto
                setModalData={setModalData}
                postData={modalData}
                handleClose={handleClose}
                open={open}
                otherUserProfileView={true}></ViewPhoto>
        </>
    );
}

function OtherUserProfile() {
    const dispatch = useDispatch();
    const otherUserId = useParams().id;
    const otherUser = useSelector(selectOtherUser);
    const loggedInUserId = useSelector(selectUserId);

    async function handleFollow(e) {
        if (e.currentTarget.dataset.myValue === 'follow')
            await dispatch(follow({ otherUserId }));
        else await dispatch(unFollow({ otherUserId }));
        dispatch(getUserProfileOfOtherUser({ otherUserId }));
        dispatch(getUserProfile({ userId: loggedInUserId }));
    }

    function search(loggedInUserId, arrOfObjsFollowers) {
        for (let i = 0; i < arrOfObjsFollowers?.length; i++) {
            if (arrOfObjsFollowers[i]?._id === loggedInUserId) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        (async () => {
            if (otherUserId) {
                await dispatch(setOtherUser({}));
                dispatch(getUserProfileOfOtherUser({ otherUserId }));
            }
        })();
    }, [dispatch, otherUserId]);
    return (
        <>
            {otherUser ? (
                <Box
                    bgcolor={'background.default'}
                    color={'text.primary'}
                    sx={{ height: 'calc(100vh - 80px)' }}>
                    <Stack
                        sx={{
                            margin: 2,
                            gap: { xs: 5, md: 10 },
                            flexDirection: { md: 'row' },
                        }}
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}>
                        <Avatar
                            sx={{
                                width: '150px',
                                height: '150px',
                                bgcolor: 'text.primary',
                            }}
                            alt={otherUser?.fullName}
                            src={otherUser?.profilePicture?.url}>
                            {otherUser?.fullName && (
                                <Typography variant="h1">
                                    {otherUser?.fullName[0]}
                                </Typography>
                            )}
                        </Avatar>
                        <Stack sx={{ width: 1 }}>
                            <Stack
                                sx={{
                                    marginBottom: 3,
                                    gap: '5px',
                                    flexDirection: { md: 'row' },
                                    alignItems: { md: 'center' },
                                }}
                                justifyContent={'space-between'}>
                                <Typography variant="h6">
                                    {otherUser?.fullName}
                                </Typography>
                                <Stack
                                    flexDirection={'row'}
                                    alignItems={'center'}>
                                    {search(
                                        loggedInUserId,
                                        otherUser?.followers
                                    ) ? (
                                        <Button
                                            sx={{ marginRight: '5px' }}
                                            data-my-value="unfollow"
                                            onClick={handleFollow}
                                            size="small"
                                            variant="contained"
                                            color="primary">
                                            Unfollow
                                        </Button>
                                    ) : (
                                        <Button
                                            sx={{ marginRight: '5px' }}
                                            data-my-value="follow"
                                            onClick={handleFollow}
                                            size="small"
                                            variant="contained"
                                            color="primary">
                                            Follow
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: 1 }}>
                                {otherUser?.interests}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: 1 }}>
                                {otherUser?.bio}
                            </Typography>
                            <Stack flexDirection={'row'} flexWrap={'wrap'}>
                                <Stack
                                    sx={{ marginRight: '20px' }}
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                    alignContent={'center'}>
                                    {' '}
                                    <CalendarMonthIcon
                                        sx={{
                                            width: '18px',
                                            marginRight: '4px',
                                        }}></CalendarMonthIcon>
                                    <Typography variant="body2">
                                        {' '}
                                        Joined{' '}
                                        {new Date(
                                            otherUser?.createdAt
                                        ).toDateString()}
                                    </Typography>
                                </Stack>
                                <Stack
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                    sx={{ marginRight: '20px' }}>
                                    {' '}
                                    <AlternateEmail
                                        sx={{
                                            width: '18px',
                                            marginRight: '4px',
                                        }}></AlternateEmail>
                                    <Typography variant="body2">
                                        {otherUser?.email}
                                    </Typography>
                                </Stack>
                                {otherUser?.website && (
                                    <Stack
                                        flexDirection={'row'}
                                        alignItems={'center'}>
                                        {' '}
                                        <InsertLinkIcon
                                            sx={{
                                                width: '18px',
                                                marginRight: '4px',
                                            }}></InsertLinkIcon>
                                        <Typography variant="body2">
                                            {' '}
                                            <Link
                                                component={RouterLink}
                                                to={otherUser?.website}
                                                target="_blank">
                                                {' '}
                                                {new URL(
                                                    otherUser?.website
                                                ).hostname.replace('www.', '')}
                                            </Link>{' '}
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack
                        flexDirection={'row'}
                        alignItems={'center'}
                        justifyContent={'space-around'}
                        sx={{
                            paddingY: { xs: 1, md: 2 },
                            borderTop: 1,
                            borderBottom: 1,
                            margin: 2,
                        }}>
                        <Stack
                            alignItems={'center'}
                            sx={{ flexDirection: { md: 'row' } }}>
                            <Typography
                                sx={{
                                    marginRight: { md: '5px' },
                                    fontWeight: '500',
                                }}>
                                {otherUser?.posts && otherUser?.posts.length > 0
                                    ? otherUser?.posts.length
                                    : '0'}
                            </Typography>
                            <Typography>posts</Typography>
                        </Stack>
                        <Stack
                            alignItems={'center'}
                            sx={{ flexDirection: { md: 'row' } }}>
                            {' '}
                            <Typography
                                sx={{
                                    marginRight: { md: '5px' },
                                    fontWeight: '500',
                                }}>
                                {otherUser?.followers &&
                                otherUser?.followers.length > 0
                                    ? otherUser?.followers.length
                                    : '0'}
                            </Typography>
                            <Typography>followers</Typography>
                        </Stack>
                        <Stack
                            alignItems={'center'}
                            sx={{ flexDirection: { md: 'row' } }}>
                            {' '}
                            <Typography
                                sx={{
                                    marginRight: { md: '5px' },
                                    fontWeight: '500',
                                }}>
                                {otherUser?.following &&
                                otherUser?.following.length > 0
                                    ? otherUser?.following.length
                                    : '0'}
                            </Typography>
                            <Typography>following</Typography>
                        </Stack>
                    </Stack>
                    <Stack
                        justifyContent={'center'}
                        flexDirection={'row'}
                        flexWrap={'wrap'}
                        sx={{ gap: 1 }}>
                        <ImagesList otherUser={otherUser}></ImagesList>
                    </Stack>
                </Box>
            ) : (
                <CircularProgress
                    sx={{
                        position: 'relative',
                        top: '50%',
                        left: '50%',
                        translate: '0 200px',
                    }}
                    variant="indeterminate"
                />
            )}
        </>
    );
}

export default OtherUserProfile;
