/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
// import statements
import { user } from '../../components/firebase/fb.user.js'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
// import { db, ref } from '../services/firebase.js';
// database
import { db } from '../../services/firebase'

// components from libs
import { ref, onValue } from "firebase/database";
// import './ClassHome.css'
import ClassCards from '../../components/cards/ClassCards'
// material ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Fade from '@mui/material/Fade';
import "bootstrap-icons/font/bootstrap-icons.css";

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Heading from '../../components/construct/Heading.js';


/**========================================================================
 **                           Generate Push ID
 *?  What does it do? Generates push ids for firebase records (i.e quizzes, classes, users, etc.)
 *@return type
 *@credit mikelehen https://gist.github.com/mikelehen/3596a30bd69384624c11
 *========================================================================**/
let generatePushID = (function () {
    var PUSH_CHARS =
        "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    var lastPushTime = 0;
    var lastRandChars = [];

    return function () {
        var now = new Date().getTime();
        var duplicateTime = now === lastPushTime;
        lastPushTime = now;

        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            now = Math.floor(now / 64);
        }
        if (now !== 0)
            throw new Error("We should have converted the entire timestamp.");

        var id = timeStampChars.join("");

        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        } else {
            for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                lastRandChars[i] = 0;
            }
            lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += PUSH_CHARS.charAt(lastRandChars[i]);
        }
        if (id.length != 20) throw new Error("Length should be 20.");

        return id;
    };
})();

export default function Classes() {
    const [loading, dataFetch] = useState(false)
    const [userClasses, setUserClasses] = useState([])
    const [noClasses, setClassStatus] = useState(false)
    const [allClasses, setAllClasses] = useState([])
    const [foundClasses, setFoundClasses] = useState([])
    const shouldFade = true;


    const navigate = useNavigate()
    useEffect(() => {
        if (loading === true) {
            document.title = ' Classes | QuizPoint'
            console.log('Loaded')
        } else {
            document.title = 'Loading Students | QuizPoint'
            console.log('Loading')


            /**==============================================
             **              loadData()
             *?  What does it do? Load data from Firebase for each student
             *=============================================**/
            function loadData() {
                // console log
                console.log('loading all students data')
                //! this should check for each users role before pushing to array
                // // wait for data
                // onValue(pathRef, (snapshot) => {
                //     // if there is no students, something definelty went wrong.
                //     if (snapshot === undefined) {
                //         console.log('ERROR - NO DATA FOUND')

                //         // if students do exist
                //     } else {
                //         // set placeholder to object of students
                //         const data = snapshot.val()
                //         // for each student value


                //         // finished loading, we can show page now
                //
                //     }
                // })


                var toBeat = 0;
                var currentNum = 0
                for (var a in user.classes) {
                    ++toBeat
                }
                console.log(user.classes)
                if (user.classes.notEnrolled) {
                    let pathRef = ref(db, '/schools/hvhs/classes')
                    onValue(pathRef, (snapshot) => {
                        if (snapshot.val() === null) {
                            // no classes
                        } else {
                            snapshot.forEach(snap => {
                                // console.log(snap.val())
                                allClasses.push(snap.val())
                            })
                            dataFetch(true)
                            setClassStatus(true)


                        }
                    })
                } else {
                    Object.keys(user.classes).forEach(function (key) {
                        console.log(key)
                        let pathRef = ref(db, `/schools/hvhs/classes/${key}`);

                        onValue(pathRef, (snapshot) => {
                            if (snapshot === undefined || snapshot === null) {
                                console.log("invalid class code")
                            } else {
                                const data = snapshot.val()
                                console.log(data)
                                if (data === null) {

                                } else if (data === 'notEnrolled') {

                                } else {
                                    console.log(data)
                                    foundClasses.push(data)
                                    ++currentNum
                                }
                            }

                            if (currentNum < toBeat) {
                                console.log('not loaded yet' + currentNum + ' ' + toBeat)
                            } else {
                                let pathRef = ref(db, '/schools/hvhs/classes')
                                onValue(pathRef, (snapshot) => {
                                    if (snapshot.val() === null) {
                                        // no classes
                                    } else {
                                        snapshot.forEach(snap => {
                                            // console.log(snap.val())
                                            allClasses.push(snap.val())
                                        })
                                        dataFetch(true)

                                    }
                                })
                                console.log(allClasses)
                            }
                        })

                        console.log(foundClasses)

                    });
                }
            }
            // trigger function
            loadData()
            console.log(allClasses)

        }
    })
    if (loading === false) {
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div className="class-home">
                    <div className="class-header">
                        <h2>Loading Information</h2>
                    </div>
                    <div className="class-body">
                        <div className="class-cards">
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                        </div>
                    </div>
                </div>
            </div>
        );


    } else if (!noClasses) {
        const classCards = foundClasses.map((classInfo) =>
            <><ClassCards classInfo={classInfo} /></>
        );
        const allClassCards = allClasses.map((classInfo) =>
            <><ClassCards classInfo={classInfo} /></>

        );
        return (
            <Fade in={shouldFade}>
                <div className="class-home">
                    <Heading text={"Classes"} />
                    <div className="class-header mt-5">
                        <p className="text-3xl text-center">Your Classes</p>
                        <p className="text 2xl text-center">Classes you are enrolled in/apart of.</p>
                        <div class="flex">
                            <div class="m-auto">
                                <button className='generic-button sml' onClick={() => navigate('/tcs/classes/create/' + generatePushID())}>Create Class</button>

                            </div>
                        </div>
                    </div>
                    <div className="class-body">
                        <div className="flex justify-center py-12">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                                {classCards}
                            </div>
                        </div>
                    </div>
                    <div className="class-header">
                        <p className="text-3xl text-center">All Classes</p>
                        <p className="text 2xl text-center">Classes you may or may not be apart of.</p>
                    </div>
                    <div className="class-body">
                        <div className="flex justify-center py-12">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                                {allClassCards}
                            </div>
                        </div>
                    </div>

                </div>
            </Fade>
        )
    } else {
        const allClassCards = allClasses.map((classInfo) =>
            <><ClassCards classInfo={classInfo} /></>
        );
        return (
            <Fade in={shouldFade}>
                <div className="class-home">
                    <div className="class-header">
                        <h2>Classes created by you</h2>
                        <button className='generic-button sml' onClick={() => navigate('/tcs/classes/create/' + generatePushID())}>Create Class</button>

                    </div>
                    <div className="class-body">
                        <p>You have no classes</p>
                    </div>
                    <div className="class-header">
                        <h2>All Classes</h2>
                        <p>All classes in your school directory.</p>
                    </div>
                    <div className="flex justify-center py-12">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                            {allClassCards}
                        </div>
                    </div>




                </div>
            </Fade>
        )


    }
}
