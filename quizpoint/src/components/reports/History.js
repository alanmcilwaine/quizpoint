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
        </>

    )
}