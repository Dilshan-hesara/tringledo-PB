import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';


const firebaseConfig = {
    apiKey: "AIzaSyCODnkiuFxCoxcMd2IRAh3yIOZyO8M7i1M",
    authDomain: "pansilbreaker-1.firebaseapp.com",
    projectId: "pansilbreaker-1",
    storageBucket: "pansilbreaker-1.firebasestorage.app",
    messagingSenderId: "566853087070",
    appId: "1:566853087070:web:50e4a785181f35fce529cf",
    measurementId: "G-P93WCDCCB9",
    databaseURL: "https://pansilbreaker-1-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);


// We do not auto-sign-in anymore. The user will log in or choose to play as a guest explicitly via LoginScreen.

import { getFirestore } from 'firebase/firestore';
export const firestore = getFirestore(app);

// We export a getter for the RTDB so it doesn't crash if the URL is missing temporarily
export const getRTDB = () => {
    try {
        return getDatabase(app);
    } catch (e) {
        console.warn("RTDB not fully initialized yet.");
        return null;
    }
};
