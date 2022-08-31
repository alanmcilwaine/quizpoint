/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import Header from './construct/Header'
import EnrolledIn from './construct/EnrolledIn'
import Overall from './construct/Overall'
import QuizTable from './construct/QuizTable'
export default function PDF({ type, student, data, course }) {
    let quizTable;
    if (type === 'class') {
        quizTable = Object.keys(course.quizzes).map(key =>
            <QuizTable quizId={key} type="completion" students={course.students} />
        )
    }

    return (
        <>
            {type === 'student' ?
                <>
                    <Header student={student} title={''} />
                    <EnrolledIn student={student} />
                </>
                : type === 'class' ?
                    <>
                        <Header title={course.className} />
                        <hr></hr>
                        <Overall course={course} />

                        {quizTable}
                    </>

                    :
                    <>

                    </>
            }

        </>
    )
}