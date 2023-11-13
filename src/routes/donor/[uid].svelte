<!-- src/routes/donor/[uid].svelte -->
<script context="module">
    import { getDatabase, ref, get } from "firebase/database";
    import { firebaseApp } from "../../firebase";
  
    export async function preload({ params }) {
      const uid = params.uid;
      const db = getDatabase(firebaseApp);
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
      const fetchedUserData = snapshot.val();
  
      return {
        uid,
        userData: {
          uid: uid,
          name: fetchedUserData?.fullName || "",
          gender: fetchedUserData?.gender || "",
          // ... other properties
        },
      };
    }
</script>

<script>
    import { onMount } from 'svelte';
  
    export let uid;
    export let userData;

    onMount(() => {
      // The userData is already provided via preload, no need to fetch again
    });
</script>
  
<h1>User ID: {uid}</h1>
<h1>Name: {userData.name}</h1>
<h1>Gender: {userData.gender}</h1>
<!-- Add other properties as needed -->
