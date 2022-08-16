/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import * as React from 'react';
import { user } from '../components/firebase/fb.user.js';
import { useNavigate } from "react-router-dom"

// material ui
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import './Dashboard.css';
const Dashboard = () => {
    let navigate = useNavigate()
    return (
        <div className="teachingsuite">
            <div className='teachingsuite-header'>
                <h2>Welcome, {user.name}</h2>
            </div>
            <div className='teachingsuite-body'>
                <h4>What would you like to do?</h4>
                <ButtonGroup variant="contained" aria-label="button group actions">
                    <Button href={'/tcs/students/all'}>View Students</Button>
                    <Button href={'/tcs/quizzes/'}>View a Quiz</Button>
                    <Button href={'/tcs/reporting'}>Generate Reports</Button>
                </ButtonGroup>
                  <h4>Need a hand with QuizPoint? <a href={'https://sites.google.com/hvhs.school.nz/quizpoint/teaching-suite'}>Check out the documentation</a></h4>
            </div>
        </div>
    )
}

export default Dashboard
