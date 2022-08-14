import Button from "@mui/material/Button";
import { useState, React } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import logo from '../main/components/logo.svg'
import { QRCode } from 'react-qrcode-logo';

import './InviteQR.css'
export default function InviteQR(props) {
    let inviteLink = `https://quizpointnz.netlify.app/invite/${props.classObject.id}`
    const [openDialog, setDialog] = useState(false)
    function QRInvite() {
        return (
            <Dialog
                className='background'
                fullScreen
                open={openDialog}
                onClose={() => setDialog(false)}
            >
                {/* app bar for title */}
                <AppBar color={'transparent'} sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setDialog(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            QuizPoint Invite for {props.classObject.classCreator}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className='inviteDialog'>
                    <div className="inviteContent">
                        <div className="inviteText">
                            <h2>Join {props.classObject.className} on QuizPoint</h2>
                            <h5>No app required, we are making it simple.</h5>
                        </div>
                        <div className="inviteQR">
                            <QRCode
                                logoImage={logo}
                                logoWidth={100}
                                logoHeight={100}
                                size={500}
                                value={inviteLink}
                                eyeRadius={12} // 5 pixel radius for all corners of all positional eyes
                            />
                        </div>

                    </div>

                </div>
            </Dialog>
        )
    }
    return (
        <>
            <Button variant="contained" onClick={() => setDialog(true)}>QR</Button>
            <QRInvite></QRInvite>
        </>

    )
}