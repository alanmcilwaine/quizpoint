/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 *
 */
// import statements
import { user } from '../firebase/fb.user.js';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
// import { db, ref } from '../services/firebase.js';
// database
import { db } from '../services/firebase'
// components from libs
import { ref, onValue } from "firebase/database";
import './ClassHome.css'
// material ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Fade from '@mui/material/Fade';

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

// responsive design
import { useMediaQuery } from 'react-responsive'

let foundClasses = []



export default function Classes() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const navigate = useNavigate()
    const [loading, dataFetch] = useState(false)
    const [enrolled, setEnrollment] = useState(true)
    const shouldFade = true;

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

                var toBeat = 0;
                var currentNum = 0
                for (var a in user.classes) {
                    ++toBeat
                }

                Object.keys(user.classes).forEach(function (key) {
                    console.log(key)
                    if (key === 'notEnrolled') {
                        setEnrollment(false)
                        dataFetch(true)
                    } else {
                        setEnrollment(true)
                        let trimmedKey = key.trim()
                        let pathRef = ref(db, `/schools/hvhs/classes/${trimmedKey}`);
                        console.log(`/schools/hvhs/classes/${trimmedKey
                            }`)
                        onValue(pathRef, (snapshot) => {
                            if (snapshot.val() === undefined || snapshot.val() === null) {
                                console.log("invalid class code")
                            } else {
                                const data = snapshot.val()
                                if (data === null) {
                                    console.log("invalid class code")
                                } else {
                                    console.log(data)
                                    foundClasses.push(data)
                                    ++currentNum
                                }
                            }

                            if (currentNum < toBeat) {
                                console.log('not loaded yet' + currentNum + ' ' + toBeat)
                                console.log(foundClasses)
                            } else {
                                dataFetch(true)
                            }
                        })
                    }


                });
            }
            // trigger function
            loadData()
            document.title = 'Your Classes | QuizPoint'
        }
    }, [loading])
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
                        <h1>Your Classes</h1>
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
                            </Stack>                        </div>

                    </div>

                </div>

            </div>
        );


    } else {
        let classCards
        if (enrolled === true) {
            classCards = foundClasses.map((classInfo) =>
                <div>
                    <Card sx={{ width: 280, height: 310 }} className="class-cards-element" onClick={() => navigate('/class/' + classInfo.code)}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="120"
                                image="https://99designs-blog.imgix.net/blog/wp-content/uploads/2018/12/Gradient_builder_2.jpg"
                                alt="green iguana"
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                </Typography>
                                <Typography variant="h4">
                                    {classInfo.className}
                                </Typography>
                            </CardContent>
                            <CardActions className="class-card-footer">
                                <Typography variant="h6" component="p">{classInfo.classCreator}</Typography>
                            </CardActions>
                        </CardActionArea>
                    </Card>

                </div>
            );
        } else {
            classCards = <div>
                <p>You need to join a class, ask your teacher for an invite link.</p>
            </div>
        }
        if (isTabletOrMobile) {
            return (
                <Fade in={shouldFade}>
                    <div className="class-home">
                        <div className="class-header">
                            <h1>Your Classes</h1>
                            <hr></hr>
                        </div>
                        <div className="class-body">
                            <div className="class-cards-mobile">
                                {classCards}
                            </div>

                        </div>

                    </div>
                </Fade>
            )
        }
        else {

            return (
                <Fade in={shouldFade}>
                    <div className="class-home">
                        <div className="class-header">
                            <h1>Your Classes</h1>
                            <hr></hr>
                        </div>
                        <div className="class-body">
                            <div className="class-cards">
                                {classCards}
                            </div>

                        </div>

                    </div>
                </Fade>
            )
        }
    }


}