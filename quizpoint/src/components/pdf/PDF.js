/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { createRef } from 'react'
import Header from './construct/Header'
import EnrolledIn from './construct/EnrolledIn'
import Overall from './construct/Overall'
import QuizTable from './construct/QuizTable'
import Footer from './construct/Footer';
import jsPDF from 'jspdf';
import ReactDOMServer from "react-dom/server";

import Pdf from "react-to-pdf";
import * as html2canvas from 'html2canvas';

export default function PDF({ type, student, data, course }) {
    const ref = createRef();

    let quizTable;
    if (type === 'class') {
        console.log(course.quizzes)
        quizTable = Object.keys(course.quizzes).map(key =>
            <QuizTable quizId={key} type="completion" students={course.students} />
        )
    }

    const options = {
        orientation: 'landscape',

    };
    const generatePDF = async () => {

        const input = document.getElementById('report');

        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'px', 'a4');
                var width = pdf.internal.pageSize.getWidth();
                var height = pdf.internal.pageSize.getHeight();

                pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
                pdf.save("test.pdf");
            });



    }

    return (
        <>
            <button onClick={generatePDF} type="button">Export PDF</button>
            <hr></hr>
            <div className="w-210mm h-297mm" style={{ width: '210mm', height: "297mm" }}>
                {type === 'student' ?
                    <>
                        <Header student={student} title={''} />
                        <EnrolledIn student={student} />
                    </>
                    : type === 'class' ?
                        <div id="report"  >
                            <Header title={course.className} />
                            <hr></hr>
                            {quizTable}
                            <Footer />
                        </div>

                        :
                        <>

                        </>
                }

            </div>
        </>
    )
}