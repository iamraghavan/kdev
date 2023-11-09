<script>
    import { onMount } from 'svelte';
    import { auth } from '../firebase'; // Import only auth from your Firebase module
    import { getDatabase, ref, get } from 'firebase/database';
    import { onAuthStateChanged } from 'firebase/auth';
  
    import { firebaseApp } from '../firebase';
  
    const db = getDatabase(firebaseApp);
    let userData = null;
  
    onMount(() => {
      // Listen for changes in user authentication state
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          // User is not authenticated, you may want to handle this case
          return;
        }
  
        const uid = user.uid;
        const userRef = ref(db, 'users/' + uid);
  
        // Fetch user data
        const snapshot = await get(userRef);
        userData = snapshot.val();
      });
    });
  </script>
  
  <main class="">
    <h1>Welcome to Your Dashboard</h1>
    <div class="user-info">
      <p><strong>Name:</strong> {userData ? userData.fullName : 'N/A'}</p>
      <!-- Add other user data fields here -->
    </div>
  </main>
  
  <style>
    main {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      padding-top: 10rem;
    }
  
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
  
    .user-info {
      background-color: #f9f9f9;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  
    p {
      margin: 0;
    }
  </style>
  