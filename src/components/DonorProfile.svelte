<!-- src/components/DonorProfile.svelte -->
<script>
    
    export let uid;
    export let fullName;
    export let age;
    export let gender;
    export let email;
    export let phoneNumber;
    export let whatsappNum;
  </script>
  
  <style>
    /* Your component styles (if any) */
    .profile-container {
      border: 1px solid #ddd;
      padding: 20px;
      margin: 10px;
    }
  
    /* Add more styles as needed */
  </style>
  
  <div class="profile-container">
    <h1>Donor Profile</h1>
    <p>UID: {uid}</p>
    <p>Full Name: {fullName}</p>
    <p>Age: {age}</p>
    <p>Gender: {gender}</p>
    <p>Email: {email}</p>
    <p>Phone Number: {phoneNumber}</p>
    <p>WhatsApp Number: {whatsappNum}</p>
  
    <!-- Add more content as needed -->
  </div>
  