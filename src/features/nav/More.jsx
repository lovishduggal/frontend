import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { selectMode, setMode } from '../user/userSlice';
import { logout } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

function More() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const mode = useSelector(selectMode);
    const navigate = useNavigate();

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    async function handleClick(e) {
        e.preventDefault();
        const mode = e.currentTarget.dataset.myValue;
        if (mode === 'light') dispatch(setMode({ mode }));
        else if (mode === 'dark') dispatch(setMode({ mode }));
        else if (mode === 'logout') {
            const { payload } = await dispatch(logout());
            if (payload?.success) {
                navigate('/login');
                setAnchorEl(null);
            }
        }
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box sx={{ position: 'absolute', right: 0, top: 12 }}>
            <Button
                color="inherit"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClickMenu}>
                More
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}>
                <MenuItem data-my-value="light" onClick={handleClick}>
                    <LightModeIcon
                        color={mode === 'light' ? 'primary' : 'inherit'}
                        sx={{
                            marginRight: 1,
                        }}
                        fontSize="small"></LightModeIcon>{' '}
                    <Typography
                        color={mode === 'light' ? 'primary' : 'inherit'}>
                        Light
                    </Typography>
                </MenuItem>
                <MenuItem data-my-value="dark" onClick={handleClick}>
                    <DarkModeIcon
                        color={mode === 'dark' ? 'primary' : 'inherit'}
                        fontSize="small"
                        sx={{ marginRight: 1 }}></DarkModeIcon>{' '}
                    <Typography color={mode === 'dark' ? 'primary' : 'inherit'}>
                        Dark
                    </Typography>
                </MenuItem>
                <MenuItem data-my-value="logout" onClick={handleClick}>
                    <LogoutIcon
                        fontSize="small"
                        sx={{ marginRight: 1 }}></LogoutIcon>{' '}
                    <Typography>Logout</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default More;
