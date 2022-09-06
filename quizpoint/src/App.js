/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

/**======================
 **   React Imports
 *========================**/
import * as React from "react";
import { useEffect, useState } from 'react';
import ReactPWAInstallProvider, { useReactPWAInstall } from "react-pwa-install";
import { Routes, Route } from "react-router-dom";
import usePWA from 'react-pwa-install-prompt'

/**======================
 **   Media Imports
 *========================**/
import myLogo from "./media/icon.svg";

/**======================
 **   Data service Imports
 *========================**/
import { GoogleOAuthProvider } from '@react-oauth/google';
import { user } from './components/firebase/fb.user.js';
import { getDatabase, ref, onValue } from "firebase/database";

/**======================
 **   Page/Component Imports
 *========================**/
import { LogOut } from './services/Login'
import ClassHome from './pages/classes/ClassHome'
import LandingPage from "./pages/login/LandingPage";
import ClassPage from './pages/classes/ClassPage'
import UserPage from './User/UserPage'
import Quiz from './pages/quiz/Quiz'
import TeachingHome from './teachingsuite/Dashboard'
import NotFoundPage from './components/feedback/404'
import Invite from './services/invite'
import Navbar from './components/navbar/Navbar'

/**======================
 *?   Teaching Suite components
 *========================**/
import Students from "./pages/tcs/Students";
import Classes from "./teachingsuite/Classes";
import Quizzes from "./teachingsuite/Quizzes";
import Reporting from "./teachingsuite/Reporting";
import RedirectLegacy from './services/RedirectLegacy'
import TeacherStudent from "./User/UserPageTeacher";
import CreateClass from "./teachingsuite/CreateClass";
import CreateQuiz from "./pages/tcs/quizzes/CreateQuiz";
import EditQuiz from "./teachingsuite/EditQuiz";
import ClassReport from "./teachingsuite/reportingfeatures/ClassReport";
import StudentReport from "./teachingsuite/reportingfeatures/StudentReport";
import ReAuthenticateTeacher from "./teachingsuite/ReAuthTeacher";
import GlobalReAuthTeacher from "./teachingsuite/GlobalReAuth"
import Setup from './teachingsuite/Setup'
/**======================
 *?   Teaching Suite components
 *========================**/
import HODHome from './hod/Home'
import Teachers from "./teachingsuite/Teachers";

/**======================
 **   MUI Imports
 *========================**/
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import InputGoogleForm from "./teachingsuite/InputForm";
import Stack from '@mui/material/Stack';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
/**======================
 **   Stylesheet Imports
 *========================**/
import "./App.css";
import Home from "./pages/tcs/Home";
import Profile from "./pages/user/Profile";
/**==============================================
 **              deepEqual
 @credit https://dmitripavlutin.com/how-to-compare-objects-in-javascript/
 *?  What does it do? Compares objects
*@param _userObject
*@param _token
 *@return type
 *=============================================**/
function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }
  return true;
}



function isObject(object) {
  return object != null && typeof object === 'object';
}

/**==============================================
 **              App()
 *?  What does it do? Main renderer for application
 *=============================================**/
function App() {
  // progressive web app definition
  const [openDataUpdated, setOpenDataUpdated] = useState(false);
  //  dialog states
  const [openDialog, setDialog] = useState(false)

  const { isStandalone, isInstallPromptSupported, promptInstall } = usePWA()

  const onClickInstall = async () => {
    const didInstall = await promptInstall()
    if (didInstall) {
      // User accepted PWA install
    }
  }

  const renderInstallButton = () => {
    if (isInstallPromptSupported && isStandalone)

      return (
        <button onClick={onClickInstall}>Prompt PWA Install</button>
      )
    return null
  }
  let action
  // handle install click

  // user not logged in
  if (user.authed === false) {
    // return less than full components
    return (
      <ReactPWAInstallProvider enableLogging>
        <GoogleOAuthProvider clientId="616231612574-unh76pn0grtjqdj5ggqg2fq7b6rti4gi.apps.googleusercontent.com">
          <div className="App">
            {/* < NavBar /> */}
            {/* <NavBar /> */}
            <Routes>
              <Route path="*" element={<LandingPage />} />
              <Route path="/*" element={<LandingPage />} />
            </Routes>
            {renderInstallButton()}

          </div>
        </GoogleOAuthProvider>
      </ReactPWAInstallProvider >

    );

    // if user is authed
  } else {
    // on value update
    const db = getDatabase();
    const userPath = ref(db, 'schools/hvhs/users/' + user.uid);
    onValue(userPath, (snapshot) => {
      console.log('Data changed')
      if (deepEqual(snapshot.val(), user)) {

      } else {
        console.log('updated data')
        localStorage.setItem('user', JSON.stringify(snapshot.val()))
      }
      action = (
        <Button color="secondary" size="small">
          lorem ipsum dolorem
        </Button>
      )
      // updateUserData(snapshot.val());
    });

    // if the user is a teacher
    if (user.role === 'teacher' || user.role === 'hod') {
      // return full components, with full access
      return (
        <ReactPWAInstallProvider enableLogging>
          <GoogleOAuthProvider clientId="616231612574-unh76pn0grtjqdj5ggqg2fq7b6rti4gi.apps.googleusercontent.com">
            <div className="App">
              <Snackbar open={openDialog} autoHideDuration={6000}>
                <SnackbarContent message="I love snacks." action={action} />

              </Snackbar>
              {/* < NavBar /> */}
              <Navbar />
              <Routes>
                <Route path="/" element={<ClassHome />} />
                <Route path="/classes" element={<ClassHome />} />
                <Route path="/class/:classId" element={<ClassPage />} />
                <Route path="/quiz/:quizId" element={<Quiz />} />
                <Route path="/invite/:id" element={<Invite />} />
                <Route path="/user/" element={<Profile />} />
                {/* Teaching Suite routes */}
                {localStorage.authToken ?
                  <>
                    <Route path="/tcs" element={<Home />} />
                    <Route path="/tcs/students/:type" element={<Students />} />
                    <Route path="/tcs/user/:id" element={<TeacherStudent />} />
                    <Route path="/tcs/teachers/:type" element={<Teachers />} />

                    <Route path="/tcs/classes" element={<Classes />} />
                    <Route path="/tcs/classes/create/:id" element={<CreateClass />} />
                    <Route path="/tcs/quizzes" element={<Quizzes />} />
                    <Route path="/tcs/quizzes/create/:id" element={<CreateQuiz />} />
                    <Route path="/tcs/quizzes/import" element={< InputGoogleForm />} />
                    <Route path="/tcs/quizzes/edit/:id" element={<EditQuiz />} />
                    <Route path="/tcs/reporting" element={<Reporting />} />
                    <Route path="/tcs/reporting/:field" element={<Reporting />} />
                    <Route path="/tcs/reports/class/:id" element={<ClassReport />} />
                    <Route path="/tcs/reports/student/:id" element={<StudentReport />} />
                    <Route path="/tcs/globalreauth/:path" element={<GlobalReAuthTeacher />} />
                    {user.role === 'hod' && <Route path="/tcs/setup" element={<Setup />} />}

                    <Route path="/tcs" element={<TeachingHome />} />
                  </>
                  :
                  <Route path='/tcs/*' element={<ReAuthenticateTeacher />} />
                }
                <Route path="/logout" element={<LogOut />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              {renderInstallButton()}

            </div>
          </GoogleOAuthProvider >
        </ReactPWAInstallProvider >

      );
    } else if (user.role === 'hod') {

      // return full components, with full access
      return (
        <ReactPWAInstallProvider enableLogging>
          <GoogleOAuthProvider clientId="616231612574-unh76pn0grtjqdj5ggqg2fq7b6rti4gi.apps.googleusercontent.com">
            <div className="App">
              <Snackbar open={openDialog} autoHideDuration={6000}>
                <SnackbarContent message="I love snacks." action={action} />

              </Snackbar>
              {/* < NavBar /> */}
              <Navbar />
              <Routes>
                <Route path="/" element={<ClassHome />} />
                <Route path="/classes" element={<ClassHome />} />
                <Route path="/class/:classId" element={<ClassPage />} />
                <Route path="/quiz/:quizId" element={<Quiz />} />
                <Route path="/invite/:id" element={<Invite />} />
                <Route path="/user" element={<Profile />} />
                {/* Teaching Suite routes */}
                {localStorage.authToken ?
                  <>
                    <Route path="/tcs" element={<TeachingHome />} />
                    <Route path="/tcs/students/:type" element={<Students />} />
                    <Route path="/tcs/teachers/:type" element={<Teachers />} />
                    <Route path="/tcs/user/:id" element={<TeacherStudent />} />
                    <Route path="/tcs/classes" element={<Classes />} />
                    <Route path="/tcs/classes/create/:id" element={<CreateClass />} />
                    <Route path="/tcs/quizzes" element={<Quizzes />} />
                    <Route path="/tcs/quizzes/create/:id" element={<CreateQuiz />} />
                    <Route path="/tcs/quizzes/import" element={< InputGoogleForm />} />
                    <Route path="/tcs/quizzes/edit/:id" element={<EditQuiz />} />
                    <Route path="/tcs/reporting" element={<Reporting />} />
                    <Route path="/tcs/reporting/:field" element={<Reporting />} />
                    <Route path="/tcs/reports/class/:id" element={<ClassReport />} />
                    <Route path="/tcs/reports/student/:id" element={<StudentReport />} />
                    <Route path="/tcs/globalreauth/:path" element={<GlobalReAuthTeacher />} />
                    <Route path="/tcs" element={<TeachingHome />} />
                    {/* HOD Roles */}
                    <Route path="/hod" element={<HODHome />} />

                  </>
                  :
                  <>
                    <Route path='/tcs/*' element={<ReAuthenticateTeacher />} />
                    <Route path='/hod/*' element={<ReAuthenticateTeacher />} />
                  </>
                }
                <Route path="/logout" element={<LogOut />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              {renderInstallButton()}

            </div>
          </GoogleOAuthProvider >
        </ReactPWAInstallProvider >

      );
    } else {
      // Start application
      return (
        <ReactPWAInstallProvider enableLogging>

          <GoogleOAuthProvider clientId="616231612574-unh76pn0grtjqdj5ggqg2fq7b6rti4gi.apps.googleusercontent.com">
            <div className="App">
              {/* < NavBar /> */}
              <Navbar />
              <Routes>
                <Route path="/" element={<ClassHome />} />
                <Route path="/classHome" element={<RedirectLegacy />} />
                <Route path="/classes" element={<ClassHome />} />
                <Route path="/class/:classId" element={<ClassPage />} />
                <Route path="/invite/:id" element={<Invite />} />
                <Route path="/quiz/:quizId" element={<Quiz />} />
                <Route path="/user/" element={<Profile />} />
                <Route path="/logout" element={<LogOut />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              {renderInstallButton()}

            </div>
          </GoogleOAuthProvider>
        </ReactPWAInstallProvider>
      );
    }
  }
}




// they need to sign in!


export default App