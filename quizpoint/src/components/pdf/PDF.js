/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import Header from './construct/Header'
import EnrolledIn from './construct/EnrolledIn'
import Overall from './construct/Overall'
export default function PDF({ type, student, data, course }) {
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
                    </>

                    :
                    <>

                    </>
            }

        </>
    )
}