<!-- src/routes/dashboard.svelte -->
<script>
    import { onMount } from 'svelte';
    import { page } from '@sapper/app';
 // Import page from svelte/store
  
    let user = null;
  
    onMount(async () => {
      // Parse the user data from the query parameter
      const queryParams = $page.query; // Use $page to access the query object
  
      const userString = queryParams.user;
  
      if (userString) {
        user = JSON.parse(decodeURIComponent(userString));
      }
    });
  </script>
  
  <h2>Welcome, {user?.fullName}</h2>
  <p>Email: {user?.email}</p>
  <p>Date of Birth: {user?.dateOfBirth}</p>
  <!-- Add more user information as needed -->
  