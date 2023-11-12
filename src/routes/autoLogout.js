import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the import path based on your project structure
import { goto } from '@sapper/app';

let timeout;

function setupAutoLogout(timeoutDuration) {
  function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // Logout logic
      localStorage.removeItem('userLoggedIn');
      auth.signOut().then(() => {
        goto('/');
      });
    }, timeoutDuration);
  }

  // Listen for changes in user authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      resetTimer(); // Reset the timer on authentication state change
    }
  });

  // Set up automatic logout after 1 minute (60000 milliseconds)
  setInterval(() => {
    // Logout logic
    localStorage.removeItem('userLoggedIn');
    auth.signOut().then(() => {
      goto('/');
    });
  }, timeoutDuration);
}

export { setupAutoLogout };
