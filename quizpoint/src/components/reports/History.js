/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */


import { ref, onValue, set, update } from "firebase/database";
import { db } from "../../services/firebase";
import { user } from '../../components/firebase/fb.user';
import { useState, useEffect, useRef } from 'react'
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { jsPDF } from "jspdf";
export default function History({ type, id }) {
    const [student, setStudent] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [history, setHistory] = useState([]);
    let PDF;
    const pdfRef = useRef(null);
    let PDFContent;
    function triggerProcess() {
        setHistory([])
        if (!type) {
            console.log('Program failed to provide type')
        } else {
            if (type === "student") {
                let pathRef = ref(db, `schools/hvhs/users/${id}/`);
                let path = onValue(pathRef, (snapshot) => {
                    const data = snapshot.val();
                    console.log(data)
                    setStudent(data);
                    let quizzes = data.quizzes;
                    if (quizzes.turnedin.notEnrolled) {
                        console.log('Not enrolled in any quizzes')

                    } else {
                        Object.keys(quizzes.turnedin).forEach(function (key) {
                            history.push(quizzes.active[key])
                        });
                    }
                    if (quizzes.active.notEnrolled) {
                        console.log('Not enrolled in any quizzes')
                    } else {
                        Object.keys(quizzes.active).forEach(function (key) {
                            history.push(quizzes.active[key])
                        });

                    }
                    console.log(history)
                    let handleDownload = () => {
                        const myTimeout = setTimeout(function () {
                            const content = pdfRef.current;

                            const doc = new jsPDF();
                            doc.html(content, {
                                callback: function (doc) {
                                    doc.save('sample.pdf');
                                },
                                html2canvas: { scale: 0.35 } // change the scale to whatever number you need
                            });

                        }, 1000);

                    };
                    handleDownload()

                }
                );

            }
        }
    }

    return (
        <>
            <button onClick={() => triggerProcess()}>Generate Report</button>
            {student ?
                <div id="studentInformation" ref={pdfRef} className="inline-flex space-x-4 items-center justify-start" style={{ width: 1280, height: 56, }}>
                    {student.picture ? <img className="w-20 h-20 rounded-lg" src={'http://www.gravatar.com/avatar'} alt="Profile Image" /> : <img className="w-20 h-20 rounded-lg" src={student.picture} alt="Profile" />}
                    <div className="inline-flex flex-col space-y-2 items-start justify-start" style={{ width: 951, height: 56, }}>
                        <p className="text-2xl font-bold leading-7 text-gray-900" style={{ width: 951, }}>{student.name}</p>
                        <div className="inline-flex space-x-6 items-center justify-start" style={{ width: 951, height: 20, }}>
                            <div className="flex space-x-1.5 items-center justify-start">
                                <p className="text-sm font-medium leading-tight text-gray-500"> {student.studentID}</p>
                            </div>
                            <div className="flex space-x-1.5 items-center justify-start">
                                <div className="relative w-1/4 h-full" />
                                <p className="text-sm font-medium leading-tight text-gray-500"><a href={'mailto:' + student.email}>{student.email}</a></p>
                            </div>

                        </div>
                    </div>

                    <div className="flex space-x-3 items-center justify-end">
                        <div className="flex space-x-2 items-center justify-center py-2 px-4 bg-white shadow border rounded-md border-gray-300">
                            <img className="w-5 h-full rounded-lg" src="https://via.placeholder.com/20x20" alt="Icon" />
                            <p className="text-sm font-medium leading-tight text-gray-700">Edit</p>
                        </div>
                        <div className="flex space-x-2 items-center justify-center py-2 px-4 bg-white shadow border rounded-md border-gray-300">
                            <img className="w-5 h-full rounded-lg" src="https://via.placeholder.com/20x20" alt="Icon" />
                            <p className="text-sm font-medium leading-tight text-gray-700">View</p>
                        </div>
                        <div className="flex space-x-2 items-center justify-center py-2 px-4 bg-indigo-600 shadow rounded-md">
                            <img className="w-1/4 h-full rounded-lg" src="https://via.placeholder.com/20x20" alt="Icon" />
                            <p className="text-sm font-medium leading-tight text-white">Publish</p>
                        </div>
                    </div>
                </div>
                : null}


        </>

    )
}