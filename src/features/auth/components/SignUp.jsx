import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Stack } from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser, signup } from '../authSlice';
function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}>
            {'Copyright © '}
            <Link id="router-link" to="https://t.co/tHBDZAWKvl" target="_blank">
                Linktree
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectLoggedInUser);

    async function handleSignUp(data) {
        const {
            payload: { success },
        } = await dispatch(signup(data));
        if (success) {
            navigate('/login');
            return reset();
        }
    }

    return (
        <>
            {isLoggedIn ? (
                <Navigate to={'/'} replace={true}></Navigate>
            ) : (
                <Stack
                    sx={{ height: '100vh' }}
                    alignItems={'center'}
                    justifyContent={'center'}>
                    <Container component="main" maxWidth="xs">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <Typography
                                variant="h3"
                                mb={'2rem'}
                                component={'h1'}
                                fontWeight={'700'}
                                fontFamily={'Dancing Script'}>
                                Pictogram
                            </Typography>

                            <Typography
                                component="h4"
                                variant="subtitle1"
                                fontWeight={'500'}
                                textAlign={'center'}>
                                Sign up to see photos and videos <br /> from
                                your friends.
                            </Typography>
                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit((data) =>
                                    handleSignUp(data)
                                )}
                                sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="given-name"
                                            {...register('fullName', {
                                                required:
                                                    'Full Name is required',
                                            })}
                                            error={
                                                errors?.fullName?.message
                                                    ? true
                                                    : false
                                            }
                                            helperText={
                                                errors?.fullName?.message
                                            }
                                            fullWidth
                                            id="fullName"
                                            label="Full Name"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            autoComplete="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^\S+@\S+\.\S+$/,
                                                    message:
                                                        'Email address is not valid',
                                                },
                                            })}
                                            error={
                                                errors?.email?.message
                                                    ? true
                                                    : false
                                            }
                                            helperText={errors?.email?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            {...register('password', {
                                                required:
                                                    'Password is required',
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/,
                                                    message:
                                                        'Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
                                                },
                                            })}
                                            error={
                                                errors?.password?.message
                                                    ? true
                                                    : false
                                            }
                                            helperText={
                                                errors?.password?.message
                                            }
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}>
                                    Sign Up
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link
                                            id="router-link"
                                            to="/login"
                                            variant="body2">
                                            Already have an account? Sign in
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <Copyright sx={{ mt: 5 }} />
                    </Container>
                </Stack>
            )}
        </>
    );
}

export default SignUp;
