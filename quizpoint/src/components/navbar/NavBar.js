/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

import logo from '../../media/logo.svg'
import icon from '../../media/icon.svg'

// import {user} from '.'
import { user } from '../firebase/fb.user'
import { useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

import { useState } from 'react';

import CreateNavbar from './CreateNavbar';
function urlContains(url, value) {
    return ~url.indexOf(value);
}

// functions for generating avatars for displaying, max did not write
function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}



const Navbar = () => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const openDialog = () => setDialogIsOpen(true)
    const closeDialog = () => setDialogIsOpen(false)
    const location = useLocation();

    // if role is teacher, display link to page
    if (user.role === 'teacher' || user.role === 'hod') {
        // if in the teaching suite, display link to dashboard
        if (urlContains(location.pathname, "/tcs")) {
            console.log("Teaching Suite Navbar")
            return (
                <CreateNavbar role="teachingSuite"/>
            )
        } else {
            // If in general page, but they are a teacher
            console.log("Teacher Navbar")
            return (
                <CreateNavbar role="teacherHome"/>
            )
        }
    } else {
        // else do not they cannot access it
        console.log("Student Navbar")
        return (
            <CreateNavbar role="student"/>
        )
    }

}

export default Navbar
