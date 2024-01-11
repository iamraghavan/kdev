<script>
   import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';

  export let userData;

  const downloadProfile = async () => {
    const profileContent = document.getElementById('profile-content');

    const canvas = await html2canvas(profileContent);
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
    pdf.save('user_profile.pdf');
  };
  </script>
  
  <style>
    /* Add your styles here */
  </style>
  
  <div id="profile-content" style="display: none;">
    <h1>User Profile</h1>
    <p>Age: {userData.age}</p>
    <p>Area: {userData.area}</p>
    <p>Blood Group: {userData.bloodGroup}</p>
    <p>City: {userData.city}</p>
    <p>Country: {userData.country}</p>
    <p>Date of Birth: {userData.dateOfBirth}</p>
    <p>Email: {userData.email}</p>
    <p>Full Name: {userData.fullName}</p>
    <p>Gender: {userData.gender}</p>
    <p>Last Update: {userData.lastUpdate}</p>
    <p>Phone Number: {userData.phoneNumber}</p>
    <p>Pincode: {userData.pincode}</p>
    <p>Rh Factor: {userData.rhFactor}</p>
    <p>Risky Activities: {userData.riskyActivities}</p>
    <p>State: {userData.state}</p>
    <p>Tattoos/Piercings: {userData.tattoosPiercings}</p>
    <p>Travel History: {userData.travelHistory}</p>
    <p>UID: {userData.uid}</p>
  </div>
  
  <ul class="btn-group style-none d-flex flex-wrap justify-content-center justify-content-lg-center">
    <li class=""><a href on:click={downloadProfile} class="btn-three">Download Certficicate <i class="fas fa-address-card"></i></a></li>
    
  </ul>
  