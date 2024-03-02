import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';
import Post from '../post/components/Post';
import { Box } from '@mui/material';
import { selectUserId } from '../auth/authSlice';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function ViewPhoto({
    setModalData,
    postData,
    handleClose,
    open,
    userProfileView,
    otherUserProfileView,
    handleCloseProfileImageModal,
}) {
    const loggedInUserId = useSelector(selectUserId);

    function search(loggedInUserId, arrOfObjsLikes) {
        for (let i = 0; i < arrOfObjsLikes?.length; i++) {
            if (arrOfObjsLikes[i]?.user === loggedInUserId) {
                return true;
            }
        }
        return false;
    }
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}>
            <Box sx={{ position: 'relative' }}>
                <Post
                    postId={postData?._id}
                    data={postData}
                    isLikedByUser={search(loggedInUserId, postData?.likes)}
                    margY={'0'}
                    allowed={loggedInUserId === postData?.user?._id}
                    setModalData={setModalData}
                    userProfileView={userProfileView}
                    otherUserProfileView={otherUserProfileView}
                    handleCloseProfileImageModal={
                        handleCloseProfileImageModal
                    }></Post>
            </Box>
        </BootstrapDialog>
    );
}

export default ViewPhoto;
