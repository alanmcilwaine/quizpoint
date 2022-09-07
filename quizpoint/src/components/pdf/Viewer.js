/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { useState, useRef, useEffect, setState } from 'react'
import PDF from './PDF'
import { useReactToPrint } from 'react-to-print';

export default function Viewer({ type, course, state, context }) {
    const [open, setDialog] = useState(true)
    const componentRef = useRef();
    const [msg, setMsg] = useState('We may be still loading your report, please wait.')
    const [pageTitle, setTitle] = useState(document.title)
    let ogTitle = document.title
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    useEffect(() => {
        if (open) {
            setTitle('Report Viewer | QuizPoint')
        } else {
            setTitle(ogTitle)
        }
        document.title = pageTitle
        let timeOut = setTimeout(function () {
            setMsg('')
        }, 10000)
    }, [open])
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: true,
        documentTitle: `QuizPoint: ${course.className} report (exported ${today})`
    });
    function handleClose() {
        window.location.reload()
    }

    return (
        <>
            {open ?

                <div className="fixed inset-0 bg-gray-600 bg-opacity-50  overflow-y-auto h-full w-full flex flex-row min-h-screen justify-center items-center">
                    <div className='bg-indigo-300	 w-300 h-full mt-3 rounded-lg'>
                        <div className='mt-2 flex justify-center items-center mb-2'>
                            <button onClick={() => handleClose()}>Close Viewer</button>
                            <button onClick={() => handlePrint()}>Export Report</button>
                        </div>
                        <div className='mt-2 flex justify-center items-center mb-2'>
                            {msg}
                        </div>

                        <div ref={componentRef} className={'bg-white'}>
                            <PDF type={type} context={context} course={course} />
                        </div>


                    </div>
                </div>
                : null}
        </>
    )
}