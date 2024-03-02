import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Button,
    CardActionArea,
    CardActions,
    Stack,
    TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPost } from '../postSlice';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../user/userSlice';
import { selectUserId } from '../../auth/authSlice';

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

function CreatePost() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [previewImage, setPreviewImage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector(selectUserId);

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

        formData.append('image', data?.image[0]);
        formData.append('content', data?.caption);

        const { payload } = await dispatch(uploadPost(formData));
        if (payload?.success) {
            navigate('/');
            dispatch(getUserProfile({ userId }));
            setPreviewImage('');
            reset();
        }
    }
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 64px)',
            }}>
            <Card
                component={'form'}
                noValidate
                onSubmit={handleSubmit((data) => onSubmit(data))}
                sx={{ width: '400px', boxShadow: 4 }}>
                <CardActionArea>
                    {previewImage ? (
                        <CardMedia
                            sx={{ objectFit: 'contain' }}
                            component="img"
                            width="400px"
                            height="400px"
                            image={previewImage}
                            alt="upload image"
                        />
                    ) : (
                        <Stack
                            justifyContent={'center'}
                            alignItems={'center'}
                            sx={{
                                width: 1,
                                height: 400,
                            }}>
                            {' '}
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                onChange={uploadImage}>
                                Upload Image
                                <VisuallyHiddenInput
                                    {...register('image', {
                                        required: 'Image is required',
                                    })}
                                    type="file"
                                />
                            </Button>
                            {errors?.image?.message && (
                                <Typography
                                    sx={{ fontSize: '12px', marginTop: '3px' }}
                                    color={'error'}>
                                    {errors?.image?.message}
                                </Typography>
                            )}
                        </Stack>
                    )}
                </CardActionArea>
                <CardContent>
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
                            required: 'Caption is required',
                        })}
                        error={errors?.caption?.message ? true : false}
                        helperText={errors?.caption?.message}
                    />
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        size="medium"
                        color="primary"
                        variant="contained">
                        Share
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}

export default CreatePost;
