/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { dbFunctionsSync } from "../../services/firebase";
import { ref, onValue, set, update } from "firebase/database";
export default function Viewer({ uid }) {
    const [student, setObject] = useState({});
    useEffect(() => {
        if (uid === '') {

        } else {
            console.log(uid)
            function retrieveUserData() {
                let pathRef = ref(db, `/schools/hvhs/users/${uid}`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // if there is no students, something definelty went wrong.
                    if (snapshot.val() === undefined) {
                        console.log("ERROR - NO DATA FOUND");
                        // if students do exist
                    } else {
                        console.log(snapshot.val())
                        setObject(snapshot.val())
                    }
                });
            }
            retrieveUserData()
        }
    }, [uid]);
    return (
        <>
            <div>
                <div>
                    <div className='studentpage-userview'>
                        {student.name === undefined ? <h1 className='selectuser-text'>Select a student</h1> :
                            <div className='user-page-container'>
                                <div className='banner-details'>
                                </div>
                                <div className="user-page-actions">

                                </div>
                                <div className="user-content">
                                    <div className="user-content-left">
                                        {/* User Profile Picture */}
                                        {/* On image hover, message displayed */}
                                        <img alt='User profile' src={student.picture}></img>
                                    </div>
                                    <div className="user-content-right">
                                        {/* Basic Student information */}
                                        <p>Name: {student.name}</p>
                                        <p>User ID: {student.uid}</p>
                                        <p>Student ID: {student.studentID}</p>
                                        {/* when you click on link, it will send email */}
                                        <p>Email: <a href={'mailto:' + student.email}>{student.email}</a></p>
                                    </div>

                                </div>
                                <div className="banner-class">
                                    {/* Banner 2 - Class */}
                                    <h5>Classes</h5>
                                </div>
                                <div className="user-classcards">
                                    <div className="classCards-row">
                                        {/* Mapped Class Cards */}

                                    </div>
                                </div>
                                <div className="banner-quiz">
                                    {/* Banner 3 - Quiz */}
                                </div>
                                <div className="user-quizhistory">

                                    {/* Quiz Section */}
                                    <div className="classCards-row">
                                        {/* Mapped Quiz Active Cards */}

                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}