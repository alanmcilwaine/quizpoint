/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { createRef, useRef } from 'react'
import Header from './construct/Header'
import EnrolledIn from './construct/EnrolledIn'
import Overall from './construct/Overall'
import QuizTable from './construct/QuizTable'
import Footer from './construct/Footer';
import jsPDF from 'jspdf';
import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from 'react-to-print';
import schoolBranding from '../../media/schoollogo.png'

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

import Pdf from "react-to-pdf";
import * as html2canvas from 'html2canvas';

export default function PDF({ type, student, data, course }) {
    const componentRef = useRef();
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
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
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: true,
        documentTitle: `QuizPoint: ${course.className} report (exported ${today})`
    });

    return (
        <div>
            <div ref={componentRef} className="w-210mm h-297mm bg-blue bg-white" style={{ width: '250mm', height: "297mm" }}>
                {type === 'student' ?
                    <>
                        <Header student={student} title={''} date={today} media={schoolBranding} />
                        <EnrolledIn student={student} />
                    </>
                    : type === 'class' ?
                        <div id="report"  >
                            <Header title={course.className} date={today} />
                            <hr></hr>
                            {quizTable}
                            <Footer />
                        </div>

                        :
                        <>

                        </>
                }

            </div>
        </div>
    )
}