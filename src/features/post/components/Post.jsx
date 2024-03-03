import { Favorite, FavoriteBorder } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Checkbox,
    CircularProgress,
    IconButton,
    Link,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, getAllPost, updatePost } from '../postSlice';
import {
    createComment,
    deleteComment,
    getAllComments,
    selectCommentStatus,
    selectComments,
    setComments,
} from '../../comment/commentSlice';
import { selectUserId } from '../../auth/authSlice';
import {
    getAllLikes,
    likePost,
    selectLikes,
    setLikes,
    unLikePost,
} from '../../like/likeSlice';
import { Link as RouterLink } from 'react-router-dom';
import {
    getUserProfile,
    getUserProfileOfOtherUser,
} from '../../user/userSlice';

const options = ['Edit', 'Delete'];
const ITEM_HEIGHT = 40;

function MenuLong({
    setIsEditing,
    setOpenCommentDialog,
    data,
    setValue,
    userProfileView,
    handleCloseProfileImageModal,
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const open = Boolean(anchorEl);
    const userId = useSelector(selectUserId);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseComments = async (e) => {
        if (e.currentTarget.dataset.myValue === 'Edit') {
            setValue('caption', data.content);
            setIsEditing(true);
            setOpenCommentDialog(false);
        }

        if (e.currentTarget.dataset.myValue === 'Delete') {
            await dispatch(deletePost({ postId: data._id }));
            await dispatch(getUserProfile({ userId }));
            if (userProfileView) {
                handleCloseProfileImageModal();
            }
        }
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ color: 'text.primary' }}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseComments}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '100px',
                        translate: '-50px 0px',
                    },
                }}>
                {options.map((option) => (
                    <MenuItem
                        sx={{ color: 'text.primary' }}
                        key={option}
                        data-my-value={option}
                        selected={option === 'Pyxis'}
                        onClick={handleCloseComments}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

function ListOfLikes() {
    const likes = useSelector(selectLikes);
    return (
        <List
            sx={{
                padding: '0px',
                width: '100%',
                bgcolor: 'background.paper',
                overflowY: 'auto',
                minHeight: '100px',
                maxHeight: 400,
                '& ul': { padding: 0 },
            }}>
            <ListSubheader>{`Post's likes`}</ListSubheader>
            {likes && likes.length > 0 ? (
                likes.map((like) => (
                    <ListItem
                        key={like?._id}
                        sx={{
                            borderBottom: 1,
                            borderTop: 1,
                            marginY: '15px',
                        }}>
                        <Stack
                            sx={{ width: '100%' }}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            gap={'5px'}>
                            <Avatar
                                alt={like?.user?.fullName}
                                src={like?.user?.profilePicture?.url}
                                sx={{
                                    bgcolor: 'text.primary',
                                    width: 32,
                                    height: 32,
                                    border: 2,
                                    borderColor: '#E43D90',
                                }}>
                                {' '}
                                {like?.user?.fullName &&
                                    like?.user?.fullName[0]}
                            </Avatar>{' '}
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    wordBreak: 'break-all',
                                    fontWeight: '500',
                                }}>
                                {like?.user?.fullName}
                            </Typography>
                        </Stack>
                    </ListItem>
                ))
            ) : (
                <CircularProgress
                    sx={{ translate: '110px 0px' }}
                    variant="indeterminate"
                />
            )}
        </List>
    );
}

function ListOfComments({
    postId,
    data,
    search,
    setModalData,
    userProfileView = false,
    otherUserProfileView = false,
}) {
    const comments = useSelector(selectComments);
    const commentStatus = useSelector(selectCommentStatus);
    const userId = useSelector(selectUserId);
    const dispatch = useDispatch();

    async function handleDelete(commentId) {
        await dispatch(deleteComment({ postId, commentId }));
        dispatch(getAllPost());
        const { payload } = await dispatch(getUserProfile({ userId }));

        if (userProfileView && payload?.success) {
            const { user } = payload;
            setModalData(search(postId, user.posts));
        }

        if (otherUserProfileView) {
            const { payload } = await dispatch(
                getUserProfileOfOtherUser({
                    otherUserId: data?.user?._id,
                })
            );
            if (payload?.success) {
                const { user } = payload;
                setModalData(search(postId, user.posts));
            }
        }
    }
    return (
        <List
            sx={{
                padding: '0px',
                width: '100%',
                bgcolor: 'background.paper',
                overflowY: 'auto',
                minHeight: '100px',
                maxHeight: 400,
                '& ul': { padding: 0 },
            }}>
            <ListSubheader>{`Post's comments`}</ListSubheader>
            {commentStatus === 'loading' ? (
                <CircularProgress
                    sx={{ translate: '110px 0px' }}
                    variant="indeterminate"
                />
            ) : comments && comments.length > 0 ? (
                comments.map((comment) => (
                    <ListItem
                        key={comment?._id}
                        sx={{
                            borderBottom: 1,
                            borderTop: 1,
                            marginY: '15px',
                        }}>
                        <Stack
                            sx={{ width: '100%' }}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={'5px'}>
                            <Stack flexDirection={'row'} alignItems={'center'}>
                                <Avatar
                                    alt={comment?.user?.fullName}
                                    src={comment?.user?.profilePicture?.url}
                                    sx={{
                                        bgcolor: 'text.primary',
                                        width: 32,
                                        height: 32,
                                        marginRight: '10px',
                                        border: 2,
                                        borderColor: '#E43D90',
                                    }}>
                                    {' '}
                                    {comment?.user?.fullName &&
                                        comment?.user?.fullName[0]}
                                </Avatar>{' '}
                                <Stack>
                                    <Typography
                                        sx={{
                                            fontSize: '14px',
                                            wordBreak: 'break-all',
                                            fontWeight: '500',
                                        }}>
                                        {comment?.user?.fullName}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '14px',
                                            wordBreak: 'break-all',
                                        }}>
                                        {comment?.content}
                                    </Typography>
                                </Stack>
                            </Stack>
                            {userId === comment.user._id && (
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => handleDelete(comment._id)}>
                                    Delete
                                </Button>
                            )}
                        </Stack>
                    </ListItem>
                ))
            ) : (
                <Typography textAlign={'center'}>
                    No comments found on this post
                </Typography>
            )}
        </List>
    );
}

function Post({
    postId,
    data,
    allowed,
    isLikedByUser,
    margY,
    setModalData,
    userProfileView = false,
    otherUserProfileView = false,
    handleCloseProfileImageModal,
}) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { isDirty, isValid },
        reset,
    } = useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [openCommentsModal, setOpenCommentsModal] = useState(false);
    const [openLikesModal, setOpenLikesModal] = useState(false);
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);

    function search(postId, arrOfObjsPosts) {
        for (let i = 0; i < arrOfObjsPosts.length; i++) {
            if (arrOfObjsPosts[i]._id === postId) {
                return arrOfObjsPosts[i];
            }
        }
    }

    function handleOpenLikes() {
        dispatch(getAllLikes({ postId }));
        setOpenLikesModal(true);
    }

    function handleCloseLikes() {
        dispatch(setLikes({}));
        setOpenLikesModal(false);
    }

    function handleOpenComments() {
        dispatch(getAllComments({ postId }));
        setOpenCommentsModal(true);
    }

    function handleCloseComments() {
        dispatch(setComments({}));
        setOpenCommentsModal(false);
    }

    async function handleLike(e) {
        if (e.target.checked) await dispatch(likePost({ postId }));
        else await dispatch(unLikePost({ postId }));
        dispatch(getAllPost());
        const { payload } = await dispatch(getUserProfile({ userId }));

        if (userProfileView && payload?.success) {
            const { user } = payload;
            setModalData(search(postId, user.posts));
        }

        if (otherUserProfileView) {
            const { payload } = await dispatch(
                getUserProfileOfOtherUser({
                    otherUserId: data?.user?._id,
                })
            );

            if (payload?.success) {
                const { user } = payload;
                setModalData(search(postId, user.posts));
            }
        }
    }

    function handleCommentDialog() {
        setOpenCommentDialog(!openCommentDialog);
        setIsEditing(false);
        reset();
    }

    function onCancel() {
        setIsEditing(false);
        reset();
    }

    async function handleSubmitted(formData) {
        const { addComment, caption } = formData;

        if (addComment) {
            await dispatch(
                createComment({ content: formData.addComment, postId })
            );
            dispatch(getAllPost());
            const { payload } = await dispatch(getUserProfile({ userId }));

            if (userProfileView && payload?.success) {
                const { user } = payload;
                setModalData(search(postId, user.posts));
            }

            if (otherUserProfileView) {
                const { payload } = await dispatch(
                    getUserProfileOfOtherUser({
                        otherUserId: data?.user?._id,
                    })
                );

                if (payload?.success) {
                    const { user } = payload;
                    setModalData(search(postId, user.posts));
                }
            }
            setOpenCommentDialog(false);
            reset();
        } else if (caption) {
            await dispatch(updatePost({ content: formData.caption, postId }));
            dispatch(getAllPost());
            const { payload } = await dispatch(getUserProfile({ userId }));
            if (userProfileView && payload?.success) {
                const { user } = payload;
                setModalData(search(postId, user.posts));
            }
            setIsEditing(false);
            reset();
        }
    }

    return (
        <Card
            component={'form'}
            noValidate
            onSubmit={handleSubmit((data) => handleSubmitted(data))}
            sx={{
                marginY: `${margY ? margY : 24}px`,
                maxWidth: '400px',
                boxShadow: 4,
                position: 'relative',
            }}>
            <CardHeader
                avatar={
                    <Avatar
                        sx={{
                            bgcolor: 'text.primary',
                            width: 54,
                            height: 54,
                            border: 3,
                            borderColor: '#E43D90',
                        }}
                        aria-label="profile-pic"
                        src={data?.user?.profilePicture?.url}>
                        {data?.user?.fullName && data?.user?.fullName[0]}
                    </Avatar>
                }
                action={
                    allowed && (
                        <MenuLong
                            setIsEditing={setIsEditing}
                            setOpenCommentDialog={setOpenCommentDialog}
                            setValue={setValue}
                            data={data}
                            userProfileView={userProfileView}
                            handleCloseProfileImageModal={
                                handleCloseProfileImageModal
                            }></MenuLong>
                    )
                }
                title={
                    <Link
                        to={
                            allowed ? `/profile` : `/profile/${data?.user?._id}`
                        }
                        component={RouterLink}
                        underline="none"
                        color={'text.primary'}
                        variant="subtitle1">
                        {data?.user?.fullName}
                    </Link>
                }
                subheader={
                    <Typography variant="caption">
                        {new Date(data?.createdAt).toDateString()}
                    </Typography>
                }
            />
            <CardMedia
                width="400px"
                component="img"
                height="400px"
                image={data?.image?.url}
                alt={data?.user?.name}
                loading="lazy"
            />
            <CardContent>
                {isEditing ? (
                    <>
                        <TextField
                            sx={{
                                width: '100%',
                                border: 'none',
                                outline: 'none',
                                '& fieldset': { border: 'none' },
                            }}
                            id="caption"
                            multiline
                            placeholder="Caption"
                            variant="standard"
                            {...register('caption', {
                                required: true,
                            })}
                        />
                        <Stack
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            sx={{ marginTop: '5px' }}>
                            <Button variant="text" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button
                                disabled={!isDirty || !isValid}
                                variant="contained"
                                type="submit"
                                size="small">
                                Save
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ wordBreak: 'break-word' }}>
                        {data?.content}
                    </Typography>
                )}
            </CardContent>
            <CardActions
                sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Stack flexDirection={'row'} alignItems={'center'}>
                    <Checkbox
                        onClick={handleLike}
                        checked={isLikedByUser}
                        icon={<FavoriteBorder sx={{ color: 'text.primary' }} />}
                        checkedIcon={<Favorite />}
                    />
                    <IconButton
                        sx={{ marginLeft: '16px' }}
                        onClick={handleCommentDialog}>
                        <ModeCommentOutlinedIcon
                            sx={{
                                color: 'text.primary',
                                cursor: 'pointer',
                            }}
                        />
                    </IconButton>
                </Stack>
                <Stack
                    flexDirection={'row'}
                    alignItems={'center'}
                    marginBottom={'5px'}>
                    <Typography
                        sx={{
                            fontSize: '14px',
                            color: 'text.primary',
                            marginX: '10px',
                            cursor: 'pointer',
                            opacity: `${data?.likes?.length === 0 ? '0' : '1'}`,
                            pointerEvents: `${
                                data?.likes?.length === 0 ? 'none' : 'auto'
                            }`,
                        }}
                        aria-label="likes-count"
                        onClick={handleOpenLikes}>
                        {data?.likes?.length} likes
                    </Typography>
                    <Modal
                        open={openLikesModal}
                        onClose={handleCloseLikes}
                        aria-labelledby="likes"
                        aria-describedby="list-of-likes">
                        <Box
                            sx={{
                                top: '50%',
                                left: '50%',
                                transform: {
                                    xs: 'translate(-52%, -50%)',
                                    sm: 'translate(-14%, -50%)',
                                },
                                width: 300,
                                maxWidth: 500,
                                bgcolor: 'background.paper',
                                position: 'absolute',
                                boxShadow: 24,
                                border: 'none',
                                p: 2,
                            }}>
                            <ListOfLikes></ListOfLikes>
                        </Box>
                    </Modal>
                    <Typography
                        htmlFor="addComment"
                        color={'text.primary'}
                        sx={{
                            fontSize: '14px',
                            color: 'text.primary',
                            cursor: 'pointer',
                            position: 'relative',
                            opacity: `${
                                data?.comments?.length === 0 ? '0' : '1'
                            }`,
                            pointerEvents: `${
                                data?.comments?.length === 0 ? 'none' : 'auto'
                            }`,
                        }}
                        aria-label="comments-count"
                        onClick={handleOpenComments}>
                        View all {data?.comments?.length} comments
                    </Typography>
                    <Modal
                        open={openCommentsModal}
                        onClose={handleCloseComments}
                        aria-labelledby="comments"
                        aria-describedby="list-of-comments">
                        <Box
                            sx={{
                                top: '50%',
                                left: '50%',
                                transform: {
                                    xs: 'translate(-52%, -50%)',
                                    sm: 'translate(-14%, -50%)',
                                },
                                width: 300,
                                maxWidth: 500,
                                bgcolor: 'background.paper',
                                position: 'absolute',
                                boxShadow: 24,
                                border: 'none',
                                p: 2,
                            }}>
                            <ListOfComments
                                postId={postId}
                                data={data}
                                search={search}
                                setModalData={setModalData}
                                userProfileView={userProfileView}
                                otherUserProfileView={
                                    otherUserProfileView
                                }></ListOfComments>
                        </Box>
                    </Modal>
                </Stack>
                {openCommentDialog && (
                    <Stack
                        padding={'10px'}
                        flexDirection={'row'}
                        alignItems={'end'}
                        width={'100%'}
                        justifyContent={'space-between'}
                        sx={{ gap: '5px' }}>
                        <TextField
                            id="addComment"
                            variant="standard"
                            label="Add comment"
                            sx={{ width: '100%' }}
                            {...register('addComment', {
                                required: true,
                            })}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            disabled={!isDirty || !isValid}>
                            Post
                        </Button>
                    </Stack>
                )}
            </CardActions>
        </Card>
    );
}

export default Post;
