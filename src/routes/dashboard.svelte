<script>
    import { onMount } from 'svelte';
    import { auth, db } from '../firebase';
  
    let email = '';
    let dateOfBirth = '';
  
    // Fetch user data on component load
    onMount(async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const snapshot = await db.ref('users/' + uid).once('value');
        const userData = snapshot.val();
        if (userData) {
          email = userData.email;
          dateOfBirth = userData.dateOfBirth;
        }
      }
    });
  </script>
  
  <main>
    <h1>Welcome to Your Dashboard</h1>
  
    <div class="user-info">
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Date of Birth:</strong> {dateOfBirth}</p>
    </div>
  </main>
  
  <style>
    main {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
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
  