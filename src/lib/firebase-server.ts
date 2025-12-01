import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// Correctly configure the Admin SDK.
// Using application default credentials requires the GOOGLE_APPLICATION_CREDENTIALS
// environment variable to be set, which is handled by the production environment.
const firebaseConfig: FirebaseOptions = {
    credential: admin.credential.applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

function getFirebase() {
    // Ensure the app is initialized only once.
    if (!getApps().length) {
        initializeApp(firebaseConfig);
    }
    const auth = getAuth();
    const db = getFirestore();
    return { auth, db, admin };
}

export { getFirebase };