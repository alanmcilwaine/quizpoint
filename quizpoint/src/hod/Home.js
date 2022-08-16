/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

import { user } from '../components/firebase/fb.user.js';
export default function Home() {
    return (
        <h1>Welcome, {user.name}</h1>
    )
}