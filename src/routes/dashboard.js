// src/routes/dashboard.js

import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { firebaseApp } from '../firebase';
export async function preload(page, session) {
  const auth = getAuth(firebaseApp);
  const db = getDatabase(firebaseApp);

  if (session.user) {
    // Fetch user data from Firebase Realtime Database
    const userRef = ref(db, 'users/' + session.user.uid); // Adjust the database path
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    // Pass the user data to the component
    page.store.update((store) => {
      store.userData = userData;
    });
  }
}
