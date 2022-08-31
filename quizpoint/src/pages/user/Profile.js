/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import Heading from '../../components/construct/Heading'
import ProfileHeader from '../../components/user/Header'
import { user } from '../../components/firebase/fb.user'
export default function Profile() {

    return (
        <>
            <ProfileHeader name={user.name} id={user.studentId} image={user.picture} email={user.email} school={'hvhs.school.nz'} />
        </>

    )
}
