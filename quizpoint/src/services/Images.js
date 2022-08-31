/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

/**========================================================================
 * * Solution to issue found on:
 * ? https://stackoverflow.com/questions/37384026/android-firebase-auth-get-users-photo
 * ? https://stackoverflow.com/users/795245/gomino
 * *
 *========================================================================**/
export default function GetHighRes(photoURL, providerId) {
    //workaround to get higer res profile picture
    let result = photoURL;
    if (providerId.includes('google')) {
        result = photoURL.replace('s96-c', 's400-c');
    } else if (providerId.includes('facebook')) {
        result = `${photoURL}?type=large`;
    }
    return result;
}