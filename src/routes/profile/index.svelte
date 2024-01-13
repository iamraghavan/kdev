<script>
  import { onMount, onDestroy } from "svelte";
  import { auth, db } from "../../firebase";
  import { ref, get } from "firebase/database";
  import { goto } from "@sapper/app";
  import html2canvas from "html2canvas";
  import axios from "axios";
  import Swal from "sweetalert2";
  import _ from "lodash";
  import Session from "./Session.svelte";



  let isProfileVisible = false;

 

  onMount(() => {
    isProfileVisible = true;
  });

  let ipAddress;
  let userData = {};

  let sessionTimeout;
  let remainingTime = 2 * 60;

  const startSessionTimer = () => {
    sessionTimeout = setInterval(() => {
      remainingTime -= 1;

      if (remainingTime <= 0) {
        clearInterval(sessionTimeout);
        showSessionEndAlert();
      }
    }, 1000);
  };

  const showSessionEndAlert = () => {
    Swal.fire({
      title: "Session Ending Soon",
      text: `Sorry ${userData.fullName}, your session will end. If you want to continue, please log in again.`,
      icon: "warning",
      timer: 2000,
      timerProgressBar: true,
      showCancelButton: false,
      showConfirmButton: false,
    }).then(() => {
      auth.signOut().then(() => {
        localStorage.clear();
        goto("/");
      });
    });
  };

  onMount(async () => {
    try {
      const response = await axios.get("https://api64.ipify.org?format=json");
      ipAddress = response.data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      ipAddress = "Error fetching IP address. See console for details.";
    }

    startSessionTimer();

    const user = auth.currentUser;

    if (!user) {
      goto("/");
      return;
    }

    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    userData = userSnapshot.val();

    if (!userData) {
      goto("/");
    }

    // Check if the alert was shown today
    const lastAlertDate = localStorage.getItem('lastAlertDate');
    const today = new Date().toLocaleDateString();

    if (!lastAlertDate || lastAlertDate !== today) {
      // Show Swal alert if any userData value is empty, none, or undefined
      if (_.some(_.values(userData), _.isEmpty)) {
        showUpdateProfileAlert();
        // Save today's date to localStorage to track that the alert was shown today
        localStorage.setItem('lastAlertDate', today);
      }
    }
  });

  onDestroy(() => {
    clearInterval(sessionTimeout);
  });

  const navigateToEditPage = () => {
    goto(`/profile/edit`);
  };

  let genderIconClass =
    userData.gender === "male"
      ? "fa-mars"
      : userData.gender === "female"
        ? "fa-venus"
        : "fa-question";

  let pageTitle = userData.fullName;
  let pageBlood = userData.bloodGroup;

  let logoImage =
    "https://firebasestorage.googleapis.com/v0/b/waggy-tails-8d2ab.appspot.com/o/Untitled-2.png?alt=media&token=cafbf7fb-ee7a-4dcb-8fab-ad428beddf70";

  let showDownloadButton = true;

  const downloadImage = async () => {
    const profileCard = document.getElementById("profile-card");

    const canvas = await html2canvas(profileCard);

    const dataURL = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "profile.png";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    showDownloadButton = false;
  };

  const showUpdateProfileAlert = () => {
    Swal.fire({
      title: "Update Your Profile",
      text: "Please update your profile information to ensure accurate details.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Update Now",
      cancelButtonText: "Update Later",
    }).then((result) => {
      if (result.isConfirmed) {
        navigateToEditPage();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: 'info',
          title: 'Update Later',
          text: 'You chose to update later.',
          confirmButtonText: 'OK',
        });
      }
    });
  };
</script>



<!-- 
<svelte:head>

</svelte:head> -->

<svelte:head>
  <title
    >{userData ? userData.fullName : "Profile"}'s Profile on Kuruhdi.com</title
  >
  <meta
    name="description"
    content="Explore {userData
      ? userData.fullName
      : 'Profile'}'s profile on Kuruhdi.com. Learn more about {userData
      ? userData.fullName
      : 'Profile'} and discover details, interests, and more. Blood Group {pageBlood}."
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
</svelte:head>

<Session />

<!-- Your modified HTML code with a single root element -->
<div class="main-page-wrapper">
  <div class="inner-banner-one position-relative">
    <div class="container">
      <div class="d-flex align-items-start align-items-xl-center">
        {#if ipAddress !== undefined}
          <p>{ipAddress}</p>
        {:else}
          <p>Loading...</p>
        {/if}

        <p style="color: red;">
          Session End : {`${Math.max(0, Math.floor(remainingTime / 60))
            .toString()
            .padStart(2, "0")}:${Math.max(0, remainingTime % 60)
            .toString()
            .padStart(2, "0")}`}
        </p>
      </div>

      <div
        class="candidate-profile-card list-layout bg-dark candidate-profile-card list-layout bg-dark"
        id="profile-card"
      >
        <div class="d-flex align-items-start align-items-xl-center">
          <div class="right-side">
            <div class="row gx-1 align-items-center">
              <div class="col-xl-2 order-xl-0">
                <div class="position-relative">
                  <h4 class="candidate-name text-white mb-0">
                    {userData.fullName || "Name Not Available"}
                  </h4>

                  <div class="candidate-post" style="padding-top: 0.50rem;">
                    {#if userData.gender === "male"}
                      <i class="fas fa-mars" style="color: #fff;"></i> Male
                    {:else if userData.gender === "female"}
                      <i class="fas fa-venus" style="color: #fff;"></i> Female
                    {:else}
                      Gender Not Available
                    {/if} | Age: {userData.age}
                  </div>
                </div>
              </div>
              <div class="col-xl-3 order-xl-3 text-white pta01">
                <span>Location</span>
                <div>
                  {userData.city}, {userData.state || "Location Not Available"}
                </div>
              </div>

              <div class="col-xl-3 col-md-4 order-xl-1">
                <div class="candidate-info">
                  <span>Contact</span>
                  <div>{userData.phoneNumber} <br /> {userData.email}</div>
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
                    
                    <button
                      class="cv-download-btn fw-500 tran3s ms-md-3 sm-mt-20"
                      on:click={navigateToEditPage}
                      ><i class="bi bi-pencil" style="margin: 0 5px;"
                      ></i>Edit Profile</button
                    >
                  </div>
                {/if}
              </div>
            </div>
            <!-- <div class="d-flex flex-column align-items-center text-center" style="padding-top: 1rem;">
                            <p class="mb-0 text-white">powered by</p>
                            <span class="mt-2" style="font-size: 1.1rem; font-family: 'McLaren', sans-serif; color:white;">Bumble Bees</span>
                          </div> -->
            <div
              class="d-sm-none justify-content-center align-items-left"
              style="padding-top: 1rem;"
            >
              <span
                class="mt-2"
                style="font-size: 1.1rem; font-family: 'McLaren', sans-serif; color:white;"
                >Powered by Bumble Bees</span
              >
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
              <div>{userData.city}, {userData.state}, {userData.country}</div>
            </li>
            <li>
              <span>Date of Birth: </span>
              <div>{userData.dateOfBirth}</div>
            </li>
            <li>
              <span>Email: </span>
              <div>
                <a href={`mailto:${userData.email}`}>{userData.email}</a>
              </div>
            </li>
            <li>
              <span>Phone Number: </span>
              <div>{userData.phoneNumber}</div>
            </li>
            <li>
              <span>WhatsApp Number: </span>
              <div>
                {#if userData.whatsapp}
                  {userData.whatsapp}
                {:else}
                  Please update WhatsApp number
                {/if}
              </div>
              
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
              <span>Travel History : </span>
              <div>
                {#if userData.travelHistory === "yes"}
                  Yes, I have a travel history
                {:else if userData.travelHistory === "no"}
                  No, I don't have a travel history
                {/if}
              </div>
            </li>
            <li>
              <span>Risky Activities : </span>
              <div>
                {#if userData.riskyActivities === "yes"}
                  Yes, I engage in risky activities
                {:else if userData.riskyActivities === "no"}
                  No, I don't engage in risky activities
                {/if}
              </div>
            </li>
            <li>
              <span>Tattoos and Piercings : </span>
              <div>
                {#if userData.tattoosPiercings === "yes"}
                  Yes, I have tattoos or piercings
                {:else if userData.tattoosPiercings === "no"}
                  No, I don't have tattoos or piercings
                {/if}
              </div>
            </li>

            <li>
              <span>Social:</span>
              <div>
                <a
                  href={`https://www.facebook.com/${userData.Facebook}`}
                  target="_blank"
                  class="me-3"><i class="bi bi-facebook"></i></a
                >
                <a
                  href={`https://instagram.com/${userData.Instagram}`}
                  target="_blank"
                  class="me-3"><i class="bi bi-instagram"></i></a
                >
                <a
                  href={`https://twitter.com/${userData.Twitter}`}
                  target="_blank"
                  class="me-3"><i class="bi bi-twitter"></i></a
                >
                <a
                  href={`https://www.linkedin.com/in/${userData.Linkedin}`}
                  target="_blank"><i class="bi bi-linkedin"></i></a
                >

              </div>
            </li>
          </ul>
        </div>
        <!-- /.cadidate-bio -->

     
        
      </div>
      
    </div>
    
  </div>


  <!-- <section class="job-portal-intro">
    <div class="container">
      <div class="wrapper bottom-border pt-10 lg-pt-80 md-pt-50 pb-65 md-pb-50">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <ul class="btn-group style-none d-flex flex-wrap justify-content-center justify-content-lg-center">
              <li class=""><a href on:click={downloadProfile} class="btn-three">Download Certficicate <i class="fas fa-address-card"></i></a></li>
              
            </ul>
          </div>
          <div class="col-lg-6">
            <ul class="btn-group style-none d-flex flex-wrap justify-content-center justify-content-lg-center">
              <li class=""><a href on:click={downloadProfile} class="btn-three">Download profile PDF <i class="fas fa-file-pdf"></i></a></li>
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section> -->



  <div class="inner-card mb-60 lg-mb-50">
   
    
    <div class="time-line-data position-relative pt-15">
      {#if userData.lastUpdate !== undefined}
      <div class="info position-relative">
          <h3 class="title">Last Profile Update</h3>
            
          
          <p class="text_1 fw-500">{userData.lastUpdate}</p>
        
        
          </div>
          {/if}
        <!-- ./info -->
        <div class="info position-relative">
          <h3 class="title">Session Details</h3>
            
          {#if userData.userSessions !== undefined}
          <p>Platform / OS : {userData.userSessions.platform}</p>
          <p>Browser : {userData.userSessions.userAgent}</p>
        {/if}
        </div>
        <!-- ./info -->
    </div>

    
    <!-- /.time-line-data -->
  </div>

</div>
{#if isProfileVisible}
<div id="profile-content" class="hidden" >
  <!-- Add your profile information here using userData -->
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



{/if}
<style>
  .hidden {
    display: none;
  }
  @media (max-width: 767px) {
    /* Add your mobile-specific styles here */

    /* Example: Set padding-top to 10px on mobile screens */
    .pta01 {
      padding-top: 1rem !important;
    }
  }

  p {
    color: #333;
    font-size: 1em;
    margin: 1rem;
  }
</style>