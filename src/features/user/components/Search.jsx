import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, CircularProgress, Stack, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import axiosInstance from '../../../app/utils/axiosInstance';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../auth/authSlice';
import useDebounce from '../../hooks/useDebounce';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function ListOfUsers({ results }) {
    const userId = useSelector(selectUserId);
    return (
        <Box>
            {results.map((user) => (
                <ListItem
                    to={`${
                        userId === user._id
                            ? '/profile'
                            : `/profile/${user._id}`
                    }`}
                    component={RouterLink}
                    key={user._id}
                    sx={{ cursor: 'pointer', marginBottom: 1 }}>
                    <ListItemButton>
                        <Avatar
                            alt={user?.fullName}
                            src={user?.profilePicture?.url}
                            sx={{
                                bgcolor: 'text.primary',
                                width: 56,
                                height: 56,
                                border: 2,
                                borderColor: '#E43D90',
                                marginRight: 2,
                            }}>
                            {' '}
                            {user?.fullName && user?.fullName[0]}
                        </Avatar>
                        <ListItemText
                            primary={user?.fullName}
                            sx={{ color: 'text.primary' }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </Box>
    );
}

function SearchBar() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //* I will implement this feature on the backend side.
    async function getAllUsers(value) {
        const response = await axiosInstance.get('/user');
        const results = response.data.users.filter(
            (user) =>
                value &&
                user &&
                user.fullName &&
                user.fullName.toLowerCase().includes(value)
        );
        setResults(results);
        if ((results && results.length > 0) || value.length === 0)
            setIsLoading(false);
        else setIsLoading(null); //* No such user found..
    }

    const handleChange = (value) => {
        setInput(value);
        setIsLoading(true);
        getAllUsers(value);
    };

    const debouncedSearch = useDebounce((query) => {
        handleChange(query);
    }, 500);

    return (
        <Box sx={{ width: '100%', height: 'calc(100vh - 64px)' }}>
            <Stack
                justifyContent={'center'}
                flexDirection={'row'}
                alignItems={'center'}>
                <Box sx={{ width: '400px' }}>
                    <Search
                        sx={{
                            width: '100%',
                            marginY: 2,
                            boxShadow: 2,
                        }}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyUp={(e) => {
                                debouncedSearch(e.target.value);
                            }}
                        />
                    </Search>
                    {isLoading ? (
                        <Typography
                            color="text.primary"
                            sx={{ textAlign: 'center' }}>
                            <CircularProgress />
                        </Typography>
                    ) : results && results.length > 0 ? (
                        <ListOfUsers results={results}></ListOfUsers>
                    ) : (
                        isLoading === null && (
                            <Typography
                                color="text.primary"
                                sx={{ textAlign: 'center' }}>
                                No such user found
                            </Typography>
                        ) //* No such user found..
                    )}
                </Box>
            </Stack>
        </Box>
    );
}

export default SearchBar;
