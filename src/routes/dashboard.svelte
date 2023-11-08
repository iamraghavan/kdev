<!-- src/routes/dashboard.svelte -->

<script>
    import { onMount } from 'svelte';
  
    // Access user data from the page variable
    let userData = page.store.userData;
  </script>
  
  <div>
    <h2>Welcome, {userData.name}</h2>
    <p>Email: {userData.email}</p>
    <p>Date of Birth: {userData.dateOfBirth}</p>
    <!-- Add more user information as needed -->
  </div>
  