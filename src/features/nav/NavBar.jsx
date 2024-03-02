import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Badge, Container, Link } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useState } from 'react';
import { Add, Home, Search, Notifications } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import More from './More';
import { useSelector } from 'react-redux';
import { selectUser } from '../user/userSlice';
const drawerWidth = 235;

function ProfileAvatar({ color }) {
    return (
        <AccountCircleIcon
            sx={{
                color,
            }}
        />
    );
}

function TopBar() {
    return (
        <AppBar
            color="transparent"
            position="fixed"
            sx={{
                boxShadow: 'none',
                borderBottom: 1,
                borderColor: 'text.primary',
                bgcolor: 'background.default',
                flexGrow: 1,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
            enableColorOnDark>
            <Toolbar sx={{ justifyContent: 'center' }}>
                {' '}
                <Typography
                    variant="h4"
                    noWrap
                    component="div"
                    fontFamily={'Dancing Script'}
                    fontWeight={'700'}
                    textAlign={'center'}
                    paddingX={'10px'}>
                    Pictogram
                </Typography>
                <More></More>
            </Toolbar>
        </AppBar>
    );
}

function LeftDrawer() {
    const location = useLocation();
    const [value, setValue] = useState(
        location.pathname === '/' ? 'home' : location.pathname.slice(1)
    );
    const user = useSelector(selectUser);
    const handleListItemClick = (event, newValue) => {
        setValue(newValue);
    };
    const drawer = (
        <div>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Avatar src={'/logo.png'}></Avatar>
            </Toolbar>
            <List
                bgcolor={'background.default'}
                color={'text.primary'}
                component="nav"
                aria-label="main mailbox folders"
                sx={{ padding: 0 }}>
                <Link
                    component={RouterLink}
                    to="/"
                    underline="none"
                    color={value === 'home' ? 'primary.main' : 'text.primary'}>
                    <ListItemButton
                        selected={value === 'home'}
                        onClick={(event) => handleListItemClick(event, 'home')}>
                        <ListItemIcon>
                            <Home
                                sx={{
                                    color: `${
                                        value === 'home'
                                            ? 'primary.main'
                                            : 'text.primary'
                                    }`,
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </Link>
                <Link
                    component={RouterLink}
                    to="/search"
                    underline="none"
                    color={value === 'search' ? 'primary' : 'text.primary'}>
                    <ListItemButton
                        selected={value === 'search'}
                        onClick={(event) =>
                            handleListItemClick(event, 'search')
                        }>
                        <ListItemIcon>
                            <Search
                                sx={{
                                    color: `${
                                        value === 'search'
                                            ? 'primary.main'
                                            : 'text.primary'
                                    }`,
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Search" />
                    </ListItemButton>
                </Link>
                <Link
                    component={RouterLink}
                    to="/create-post"
                    underline="none"
                    color={
                        value === 'create-post' ? 'primary' : 'text.primary'
                    }>
                    <ListItemButton
                        selected={value === 'create-post'}
                        onClick={(event) =>
                            handleListItemClick(event, 'create-post')
                        }>
                        <ListItemIcon>
                            <Add
                                sx={{
                                    color: `${
                                        value === 'create-post'
                                            ? 'primary.main'
                                            : 'text.primary'
                                    }`,
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText primary="New Post" />
                    </ListItemButton>
                </Link>
                <Link
                    component={RouterLink}
                    to="/notifications"
                    underline="none"
                    color={
                        value === 'notifications'
                            ? 'primary.main'
                            : 'text.primary'
                    }>
                    <ListItemButton
                        selected={value === 'notifications'}
                        onClick={(event) =>
                            handleListItemClick(event, 'notifications')
                        }>
                        <ListItemIcon>
                            <Badge
                                color="secondary"
                                badgeContent={user?.notifications?.length}>
                                <Notifications
                                    sx={{
                                        color: `${
                                            value === 'notifications'
                                                ? 'primary.main'
                                                : 'text.primary'
                                        }`,
                                    }}
                                />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary="Notifications" />
                    </ListItemButton>
                </Link>
                <Link
                    component={RouterLink}
                    to="/profile"
                    underline="none"
                    color={
                        value === 'profile' ? 'primary.main' : 'text.primary'
                    }>
                    <ListItemButton
                        selected={value === 'profile'}
                        onClick={(event) =>
                            handleListItemClick(event, 'profile')
                        }>
                        <ListItemIcon>
                            <ProfileAvatar
                                color={
                                    value === 'profile'
                                        ? 'primary.main'
                                        : 'text.primary'
                                }
                            />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                </Link>
            </List>
        </div>
    );

    return (
        <Box
            component="nav"
            sx={{
                width: { sm: drawerWidth },
                flexShrink: { sm: 0 },
            }}
            aria-label="mailbox folders">
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderColor: 'text.primary',
                    },
                    border: 10,
                    borderColor: 'text.primary',
                }}
                open>
                {drawer}
            </Drawer>
        </Box>
    );
}

function BottomNav() {
    const location = useLocation();

    const [value, setValue] = useState(
        location.pathname === '/' ? 'home' : location.pathname.slice(1)
    );
    const handleChange = (event, newValue) => {
        console.log(event, newValue);
        setValue(newValue);
    };
    return (
        <Box
            bgcolor={'background.default'}
            color={'text.primary'}
            sx={{
                width: 1,
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: 1,
                borderColor: 'text.primary',
                display: { xs: 'block', sm: 'none' },
            }}>
            <Container>
                <BottomNavigation
                    sx={{
                        width: 1,
                    }}
                    value={value}
                    onChange={handleChange}>
                    <BottomNavigationAction
                        component={RouterLink}
                        to="/"
                        label="Home"
                        value="home"
                        icon={
                            <Home
                                sx={{
                                    color: `${
                                        value === 'home'
                                            ? 'primary'
                                            : 'text.primary'
                                    }`,
                                }}
                            />
                        }
                        alt="Home"
                    />
                    <BottomNavigationAction
                        component={RouterLink}
                        to="/search"
                        label="Search"
                        value="search"
                        icon={
                            <Search
                                sx={{
                                    color: `${
                                        value === 'search'
                                            ? 'primary'
                                            : 'text.primary'
                                    }`,
                                }}
                            />
                        }
                    />
                    <BottomNavigationAction
                        component={RouterLink}
                        to="/create-post"
                        label="New Post"
                        value="create-post"
                        icon={
                            <Add
                                sx={{
                                    color: `${
                                        value === 'create-post'
                                            ? 'primary'
                                            : 'text.primary'
                                    }`,
                                }}
                            />
                        }
                    />
                    <BottomNavigationAction
                        component={RouterLink}
                        to="/notifications"
                        label="Notification"
                        value="notifications"
                        icon={
                            <Notifications
                                sx={{
                                    color: `${
                                        value === 'notifications'
                                            ? 'primary'
                                            : 'text.primary'
                                    }`,
                                }}
                            />
                        }
                    />

                    <BottomNavigationAction
                        component={RouterLink}
                        to="/profile"
                        label="Profile"
                        value="profile"
                        icon={
                            <ProfileAvatar
                                color={
                                    value === 'profile'
                                        ? 'primary'
                                        : 'text.primary'
                                }
                            />
                        }
                    />
                </BottomNavigation>
            </Container>
        </Box>
    );
}

function NavBar({ children }) {
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <TopBar></TopBar>
                <LeftDrawer></LeftDrawer>
                <Container
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: {
                            sm: `calc(100% - ${drawerWidth}px)`,
                        },
                    }}>
                    <Toolbar />
                    {children}
                </Container>
            </Box>
            <BottomNav></BottomNav>
        </>
    );
}

export default NavBar;
