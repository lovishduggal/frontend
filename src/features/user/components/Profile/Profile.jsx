import {
    Avatar,
    Box,
    Button,
    Stack,
    Typography,
    Link,
    CardMedia,
    TextField,
    Toolbar,
    CircularProgress,
} from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    getUserProfile,
    selectUser,
    selectUserStatus,
    updateUserProfile,
} from '../../userSlice';
import { AlternateEmail } from '@mui/icons-material';
import ViewPhoto from '../../../common/ViewPhoto';
import { getAllPost } from '../../../post/postSlice';

function ImagesList({ user }) {
    const [open, setOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const handleClickOpen = (post) => {
        setModalData(post);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            {user &&
                user?.posts?.length > 0 &&
                user.posts.map((post) => (
                    <div key={post._id}>
                        <ImageListItem
                            sx={{ width: 300, cursor: 'pointer' }}
                            onClick={() => {
                                handleClickOpen(post);
                            }}>
                            <img
                                srcSet={`${post?.image?.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                src={`${post?.image?.url}?w=164&h=164&fit=crop&auto=format`}
                                alt={post?.content}
                                loading="lazy"
                            />
                        </ImageListItem>
                        <ViewPhoto
                            setModalData={setModalData}
                            postData={modalData}
                            handleClose={handleClose}
                            open={open}
                            userProfileView={true}
                            handleCloseProfileImageModal={
                                handleClose
                            }></ViewPhoto>
                    </div>
                ))}
        </>
    );
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function EditProfileDialog({
    open,
    handleClose,
    user,
    previousProfilePicture,
    register,
    handleSubmit,
    reset,
    errors,
    userId,
}) {
    const [previewImage, setPreviewImage] = useState('');
    const dispatch = useDispatch();

    function uploadImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setPreviewImage(reader.result);
        };
    }

    async function onSubmit(data) {
        const formData = new FormData();
        formData.append('image', data.image[0]);
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('bio', data.bio);
        formData.append('website', data.website);
        formData.append('interests', data.interests);

        const { payload } = await dispatch(updateUserProfile(formData));
        if (payload.success) {
            dispatch(getAllPost());
            dispatch(getUserProfile({ userId }));
            handleClose();
            setPreviewImage('');
            reset();
        }
    }
    return (
        <BootstrapDialog
            spacing={1}
            component={'form'}
            noValidate
            onClose={handleClose}
            onSubmit={handleSubmit((data) => onSubmit(data))}
            aria-labelledby="customized-dialog-title"
            open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Edit Profile
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}>
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Stack
                    alignItems={'center'}
                    spacing={1}
                    sx={{ marginBottom: 2 }}>
                    {previousProfilePicture || previewImage ? (
                        <CardMedia
                            sx={{
                                borderRadius: '50%',
                                width: '150px',
                                height: '150px',
                                objectFit: 'contain',
                            }}
                            component="img"
                            height="auto"
                            image={
                                previewImage
                                    ? previewImage
                                    : previousProfilePicture
                            }
                            alt="change image"
                        />
                    ) : (
                        <Avatar
                            sx={{
                                width: '150px',
                                height: '150px',
                                bgcolor: 'text.primary',
                            }}
                            alt={user?.fullName}
                            src={user?.profilePicture?.url}>
                            {user?.fullName && (
                                <Typography variant="h1">
                                    {user?.fullName[0]}
                                </Typography>
                            )}
                        </Avatar>
                    )}
                    <Stack justifyContent={'center'} alignItems={'center'}>
                        {' '}
                        <Button
                            size="small"
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            onChange={uploadImage}>
                            Change Image
                            <VisuallyHiddenInput
                                {...register('image')}
                                type="file"
                            />
                        </Button>
                    </Stack>
                </Stack>
                <TextField
                    sx={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        '& fieldset': { border: 'none' },
                        marginBottom: 2,
                    }}
                    id="name"
                    multiline
                    placeholder="Name"
                    variant="standard"
                    {...register('name', {
                        required: 'Name is required',
                    })}
                    error={errors?.name?.message ? true : false}
                    helperText={errors?.name?.message}
                />
                <TextField
                    sx={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        '& fieldset': { border: 'none' },
                        marginBottom: 2,
                    }}
                    id="email"
                    multiline
                    placeholder="Email"
                    variant="standard"
                    {...register('email', {
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Email address is not valid',
                        },
                    })}
                    error={errors?.email?.message ? true : false}
                    helperText={errors?.email?.message}
                />
                <TextField
                    sx={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        '& fieldset': { border: 'none' },
                        marginBottom: 2,
                    }}
                    id="interests"
                    multiline
                    placeholder="Interests"
                    variant="standard"
                    {...register('interests')}
                />
                <TextField
                    sx={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        '& fieldset': { border: 'none' },
                        marginBottom: 2,
                    }}
                    id="bio"
                    multiline
                    placeholder="Bio"
                    variant="standard"
                    {...register('bio')}
                />
                <TextField
                    sx={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        '& fieldset': { border: 'none' },
                        marginBottom: 2,
                    }}
                    id="website"
                    multiline
                    placeholder="Website"
                    variant="standard"
                    {...register('website')}
                />
            </DialogContent>
            <DialogActions>
                <Button type="submit" variant="contained">
                    Save changes
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}

function Profile() {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();
    const user = useSelector(selectUser);
    const userStatus = useSelector(selectUserStatus);

    const handleClickOpen = () => {
        setValue('name', user?.fullName);
        setValue('email', user?.email);
        setValue('bio', user?.bio);
        setValue('website', user?.website);
        setValue('interests', user?.interests);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Stack alignItems={'center'}>
            {userStatus === 'loading' ? (
                <>
                    <Toolbar />
                    <CircularProgress variant="indeterminate" />
                </>
            ) : (
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
                            alt={user?.fullName}
                            src={user?.profilePicture?.url}>
                            {user?.fullName && (
                                <Typography variant="h1">
                                    {user?.fullName[0]}
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
                                    {user?.fullName}
                                </Typography>
                                <Stack
                                    flexDirection={'row'}
                                    alignItems={'center'}>
                                    <Button
                                        color="primary"
                                        size="small"
                                        variant="outlined"
                                        onClick={handleClickOpen}>
                                        Edit Profile
                                    </Button>
                                    <EditProfileDialog
                                        open={open}
                                        user={user}
                                        handleClose={handleClose}
                                        previousProfilePicture={
                                            user?.profilePicture?.url
                                        }
                                        register={register}
                                        handleSubmit={handleSubmit}
                                        reset={reset}
                                        errors={errors}
                                        userId={user?._id}></EditProfileDialog>
                                </Stack>
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: 1 }}>
                                {user?.interests || 'No Interests'}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ marginBottom: 1 }}>
                                {user?.bio || 'No, Bio'}
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
                                            user?.createdAt
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
                                        {user?.email}
                                    </Typography>
                                </Stack>
                                {user?.website && (
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
                                                to={user?.website}
                                                target="_blank">
                                                {' '}
                                                {new URL(
                                                    user?.website
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
                                {user?.posts && user?.posts.length > 0
                                    ? user?.posts.length
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
                                {user?.followers && user?.followers.length > 0
                                    ? user?.followers.length
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
                                {user?.following && user?.following.length > 0
                                    ? user?.following.length
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
                        <ImagesList user={user}></ImagesList>
                    </Stack>
                </Box>
            )}
        </Stack>
    );
}

export default Profile;
