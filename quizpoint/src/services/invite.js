/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

/**======================
 **  React Imports
 *========================**/import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
/**======================
 **   Data service Imports
 *========================**/
import { user } from "../components/firebase/fb.user";
import { db, dbFunctions, dbFunctionsSync } from '../services/firebase'
import { ref, onValue, update, set } from "firebase/database";
/**======================
 **   MUI Imports
 *========================**/
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from "@mui/material/Button";
/**======================
 **   Stylesheet Imports
 *========================**/
import './Invite.css'


/**========================================================================
 *                             Invite Module
 *========================================================================**/
export default function Invite() {

    // references
    const { id } = useParams();
    // navigate reference
    const navigate = useNavigate()
    // states
    const [loading, setLoading] = useState(true)
    const [shouldFade] = useState(true)
    const [classObject, setClassObject] = useState({})
    /**==============================================
     **              joinClass
     *?  What does it do? Handles data for class joining
     *@return type
     *=============================================**/
    function joinClass() {
        // ref to user id for cleaner code
        let userId = user.uid;

        // create a new student object to push to class ref
        let dataToWrite = {
            [userId]: userId,
        }
        // create a new class object to push to student obj
        let dataToWriteToUser = {
            classCode: id,
            quizzes: classObject.quizzes
        }
        // set up updates
        // update data in class at class id in path students
        dbFunctionsSync.write('/schools/hvhs/classes/' + id + '/students/', dataToWrite)
        // set(ref(db, '/schools/hvhs/classes/' + id + '/students/'), dataToWrite);

        // update data in student at student id in path class
        dbFunctionsSync.write('/schools/hvhs/users/' + userId + '/classes/' + id, dataToWriteToUser)
        // set(ref(db, '/schools/hvhs/users/' + userId + '/classes/' + id, { dataToWriteToUser }));
        update(ref(db, 'schools/hvhs/users/' + user.uid + '/classes/'), { notEnrolled: null });

        // navigate home
        navigate('/classes')
        // update data in firebase

    }
    // while state is loading...
    useEffect(() => {
        // if loading
        if (loading) {
            // feedback to title
            document.title = 'Loading Invite | QuizPoint'
            /**==============================================
             **              LoadData
             *?  What does it do? Handles data loading in firebase
             *=============================================**/
            function loadData() {
                // ref to db
                const pathRef = ref(db, `/schools/hvhs/classes/${id}`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // should be some error handling here
                    if (snapshot.val() === null) {
                        console.log('error')
                    } else {
                        // set class object up, and finish loading
                        setClassObject(snapshot.val())
                        setLoading(false)
                    }
                })
            }
            // run func
            loadData()

        } else {
            // loaded, we are done here
            document.title = 'Class Invite | QuizPoint'
        }
    })

    // if loading
    if (loading) {
        // return loading screen
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div >
        );

        // if loaded
    } else {
        // return class info and button to join
        return (
            <div className="invite-container">
                <h2>You've been invited to {classObject.className} by {classObject.classCreator}</h2>
                <h3>{classObject.classDescription}</h3>
                <Button variant="contained" onClick={joinClass}>Join Class</Button>
            </div>
        )
    }

}