

<script>
  import { onMount } from 'svelte';
  import { auth, db } from '../../firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { ref, get } from 'firebase/database';
  import { goto } from '@sapper/app';
  import BloodCta from '../../components/BloodCTA.svelte';
  import html2canvas from 'html2canvas';

  let userData = {};

  onMount(async () => {
    // Check if the user is signed in using Firebase Authentication
    const user = auth.currentUser;

    if (!user) {
      // Redirect to the home page if the user is not signed in
      goto('/');
      return;
    }

    // Fetch user data from Firebase Realtime Database
    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    userData = userSnapshot.val();

    // Redirect to the home page if the user data is not available
    if (!userData) {
      goto('/');
    }
  });

  const navigateToEditPage = () => {
    goto(`/profile/edit`);
  };

  let genderIconClass = userData.gender === 'male' ? 'fa-mars' : userData.gender === 'female' ? 'fa-venus' : 'fa-question';

  let pageTitle = userData.fullName;
  let pageBlood = userData.bloodGroup;

  let logoImage = 'https://firebasestorage.googleapis.com/v0/b/waggy-tails-8d2ab.appspot.com/o/Untitled-2.png?alt=media&token=cafbf7fb-ee7a-4dcb-8fab-ad428beddf70';

  let showDownloadButton = true;

  const downloadImage = async () => {
    const profileCard = document.getElementById('profile-card');

    const canvas = await html2canvas(profileCard);

    const dataURL = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'profile.png';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    // Hide the download button and show the logo image after clicking
    showDownloadButton = false;
  };
</script>


<!-- 
<svelte:head>

</svelte:head> -->

<svelte:head>
  <title>{userData ? userData.fullName : 'Profile'}'s Profile on Kuruhdi.com</title>
  <meta name="description" content="Explore {userData ? userData.fullName : 'Profile'}'s profile on Kuruhdi.com. Learn more about {userData ? userData.fullName : 'Profile'} and discover details, interests, and more. Blood Group {pageBlood}.">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>



</svelte:head>


<style>
  @media (max-width: 767px) {
  /* Add your mobile-specific styles here */

  /* Example: Set padding-top to 10px on mobile screens */
  .pta01{
    padding-top: 1rem !important;
  }
}
</style>

<!-- Your modified HTML code with a single root element -->
<div class="main-page-wrapper">
  <div class="inner-banner-one position-relative ">
    <div class="container">
      <div class="candidate-profile-card list-layout bg-dark candidate-profile-card list-layout bg-dark" id="profile-card">
                  <div class="d-flex align-items-start align-items-xl-center">
                      
                      <div class="right-side">
                          <div class="row gx-1 align-items-center">
                              <div class="col-xl-2 order-xl-0">
                                  <div class="position-relative">
                                      <h4 class="candidate-name text-white mb-0"> {userData.fullName || 'Name Not Available'}</h4>
                                   
                                      <div class="candidate-post">
                                        
                                        {userData.gender || 'Gender Not Available'} | Age : {userData.age}
                                      </div>
                                  </div>
                              </div>
                              <div class="col-xl-3 order-xl-3 text-white pta01" >
                                <span>Location</span>
                                <div>{userData.city}, {userData.state || 'Location Not Available'}</div>
                              </div>
                              
                              <div class="col-xl-3 col-md-4 order-xl-1">
                                  <div class="candidate-info">
                                      <span>Contact</span>
                                      <div>{userData.phoneNumber} <br> {userData.email} </div>
                                  </div>
                                  <!-- /.candidate-info -->
                              </div>
              <div class="col-xl-2 col-md-4 order-xl-2">
                                  <div class="candidate-info">
                                      <span>Blood Group</span>
                                      <div>{userData.bloodGroup}</div>
                                  </div>
                                  <!-- /.candidate-info -->
                              </div>
                              <!-- Your HTML code -->
                              <div class="col-xl-2 col-md-4 order-xl-4">
                                {#if showDownloadButton}
                                  <div class="d-flex justify-content-md-end">
                                    <button class="save-btn text-center tran3s" on:click={downloadImage}><i class="bi bi-download"></i></button>
                                    <button class="cv-download-btn fw-500 tran3s ms-md-3 sm-mt-20" on:click={navigateToEditPage}><i class="bi bi-pencil" style="margin: 0 5px;"></i>Edit</button>
                                  </div>
                              
                                 
                                {/if}
                              </div>
                              

                              
                          </div>
                          <!-- <div class="d-flex flex-column align-items-center text-center" style="padding-top: 1rem;">
                            <p class="mb-0 text-white">powered by</p>
                            <span class="mt-2" style="font-size: 1.1rem; font-family: 'McLaren', sans-serif; color:white;">Bumble Bees</span>
                          </div> -->
                          <div class="d-sm-none justify-content-center align-items-left" style="padding-top: 1rem;">
                            <span class="mt-2" style="font-size: 1.1rem; font-family: 'McLaren', sans-serif; color:white;">Powered by Bumble Bees</span>
                          </div>
                          
                          
                          
                      </div>
                  </div>
              </div> 
    </div>

  </div>
</div>


<div class="container">
  <div class="row">
    <div class="col-xxl-6 col-lg-6">
      <div class="cadidate-profile-sidebar ms-xl-5 ms-xxl-0 md-mt-60">
          <div class="cadidate-bio bg-wrapper mb-60 md-mb-40">
              <ul class="style-none">
                  <li class="border-0">
                      <span>Location: </span>
                      <div>{userData.city}, {userData.state}, {userData.country}  </div>
                  </li>
                  <li>
                      <span>Date of Birth: </span>
                      <div>{userData.dateOfBirth}</div>
                  </li>
                  <li>
                      <span>Email: </span>
                      <div><a href={`mailto:${userData.email}`}>{userData.email}</a>
                      </div>
                  </li>
                  <li>
                      <span>Phone Number: </span>
                      <div>{userData.phoneNumber}</div>
                  </li>
                  <li>
                      <span>WhatsApp Number: </span>
                      <div>{userData.whatsapp}</div>
                  </li>
                
                 
              </ul>
             
          
            </div>
          <!-- /.cadidate-bio -->
       
      
      </div> 
      <!-- /.cadidate-profile-sidebar -->
    </div>
    <div class="col-xxl-6 col-lg-6">
      <div class="cadidate-profile-sidebar ms-xl-5 ms-xxl-0 md-mt-60">
          <div class="cadidate-bio bg-wrapper mb-60 md-mb-40">
              <ul class="style-none">
                  <li class="border-0">
                      <span>Last Donation Date: </span>
                      <div>{userData.LastDonationDate || "None of Donation"}</div>
                  </li>
                  <li>
                      <span>Travel History :  </span>
                      <div>{#if userData.travelHistory === 'yes'}
                        Yes, I have a travel history
                      {:else if userData.travelHistory === 'no'}
                        No, I don't have a travel history
                      {/if}</div>
                  </li>
                  <li>
                      <span>Risky Activities : </span>
                      <div>{#if userData.riskyActivities === 'yes'}
                        Yes, I engage in risky activities
                      {:else if userData.riskyActivities === 'no'}
                      No, I don't engage in risky activities
                      {/if}
                      </div>
                  </li>
                  <li>
                      <span>Tattoos and Piercings : </span>
                      <div>{#if userData.tattoosPiercings === 'yes'}
                        Yes, I have tattoos or piercings
                      {:else if userData.tattoosPiercings === 'no'}
                      No, I don't have tattoos or piercings
                      {/if}</div>
                  </li>
                  
                
                  <li>
                      <span>Social:</span>
                      <div>
                          <a href="{`https://www.facebook.com/${userData.Facebook}`}" target="_blank" class="me-3"><i class="bi bi-facebook"></i></a>
                          <a href="{`https://instagram.com/${userData.Instagram}`}" target="_blank" class="me-3"><i class="bi bi-instagram"></i></a>
                          <a href="{`https://twitter.com/${userData.Twitter}`}" target="_blank" class="me-3"><i class="bi bi-twitter"></i></a>
                          <a href="{`https://www.linkedin.com/in/${userData.Linkedin}`}" target="_blank"><i class="bi bi-linkedin"></i></a>
                      </div>
                  </li>
              </ul>
             
          
            </div>
          <!-- /.cadidate-bio -->
       
      
      </div> 
      <!-- /.cadidate-profile-sidebar -->
    </div>
  </div>
</div>

<BloodCta />