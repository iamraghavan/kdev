<script>
  import { onMount } from 'svelte';
  import { ref } from 'firebase/database';
  import { auth, db } from '../../firebase'; // Import your Firebase database instance
  import { params } from '@sveltejs/kit'; // Change this line

  let userData;
  let loading = true;

  onMount(async () => {
    // Access route parameters through the params store
    const { uid } = $params;

    console.log('UID before creating reference:', uid); // Log the UID to the console

    if (!uid) {
      // Handle the case when uid is not available
      console.error('User not found');
      loading = false;
      return;
    }

    // Create a reference to the user in the database
    const userRef = ref(db, `users/${uid}`);

    try {
      // Get user data from the database
      const userSnapshot = await get(userRef);
      userData = userSnapshot.val();
      console.log('UserData:', userData); // Log the user data to the console
      loading = false;
    } catch (error) {
      console.error('Error fetching user data:', error);
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  {#if userData}
    <div>
      <h2>{userData.fullName}</h2>
      <p>Age: {userData.age}</p>
      <p>Gender: {userData.gender}</p>
      <!-- Add other user details as needed -->
    </div>
  {:else}
    <p>User not found</p>
  {/if}
{/if}
