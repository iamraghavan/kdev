<!-- src/routes/donor/[uid].svelte -->
<script context="module">
    import { getDatabase, ref, get } from "firebase/database";
    import { firebaseApp } from "../../firebase";
  
    let callnow = "Make a Call to the Donor";
    export async function preload({ params }) {
      const uid = params.uid;
      const db = getDatabase(firebaseApp);
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
      const fetchedUserData = snapshot.val();
  
      return {
        uid,
        userData: {
          
          name: fetchedUserData?.fullName || "",
      gender: fetchedUserData?.gender || "",
      country: fetchedUserData?.country || "",
      dateOfBirth: fetchedUserData?.dateOfBirth || "",
      age: fetchedUserData?.age || "",
      phoneNumber: fetchedUserData?.phoneNumber || "",
      pincode: fetchedUserData?.pincode || "",
      city: fetchedUserData?.city || "",
      state: fetchedUserData?.state || "",
      division: fetchedUserData?.division || "",
      whatsappNum: fetchedUserData?.whatsapp || "WhatsApp Number",
      email: fetchedUserData?.email || "",
      bloodGroup: fetchedUserData?.bloodGroup || "",
      rhFactor: fetchedUserData?.rhFactor || "",
      travelHistory: fetchedUserData?.travelHistory || "",
      riskyActivities: fetchedUserData?.riskyActivities || "",
      tattoosPiercings: fetchedUserData?.tattoosPiercings || "",
      lddate: fetchedUserData?.lddate || "",
      instagram: fetchedUserData?.Instagram || "",
      facebook: fetchedUserData?.Facebook || "",
      twitter: fetchedUserData?.Twitter || "",
      linkedin: fetchedUserData?.Linkedin || "",
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

    import Banner from "../../components/InnerBanner.svelte";
  import Team from '../../components/Team.svelte';
  
  let pageLinks = [
    { text: 'Home', url: '/' },
    { text: 'About' },
  ];

</script>

<style>
    .none{
        display: none;
    }
    </style>
  <div class="none">{uid}</div>
  
<div class="main-page-wrapper">

    <div>
    <Banner title={`${userData.name} kurudhi.com profile, check it out!`}  />
  </div>

<section class="company-details pt-10 lg-pt-10 pb-160 xl-pb-150 lg-pb-80 bg-white">
        <div class="container">
            <div class="row">
                <div class="col-xxl-12 col-xl-12 ">
                    <div class="job-company-info ms-xl-5 ms-xxl-0 lg-mb-50">
        
                        <div class="text-md text-dark text-center mt-15 mb-20 lg-mb-10"><h3>{userData.name}</h3></div>
                        <p>
  Hey there! Meet {userData.name}, our awesome donor. 🌟 Give it up for {userData.name}! 👏
  Don't forget to share the love! 💖 #DonationHero
</p>
                        <div class="border-top mt-35 lg-mt-20 pt-25">
                            <ul class="job-meta-data row style-none">
                                <li class="col-lg-6">
                                    <span>Location: </span>
                                    <div>{userData.city}, {userData.state}, {userData.country} </div>
                                </li>
                                <li class="col-lg-6">
                                    <span>Date of Birth:</span>
                                    <div>{userData.dateOfBirth}</div>
                                </li>
                                <li class="col-lg-6">
                                    <span>Email: </span>
                                    <div><a href={`mailto:${userData.email}`}>{userData.email}</a></div>
                                </li>
                                <li class="col-lg-6">
                                    <span>Phone Number: </span>
                                    <div><a href={`tel:+91${userData.phoneNumber}`}>{userData.phoneNumber}</a></div>
                                </li>
                                <li class="col-lg-6">
                                    <span>WhatsApp Number:</span>
                                    <div><a href={`tel:+91${userData.whatsappNum}`}>{userData.whatsappNum || "Sorry, the donor has no WhatsApp number."}</a></div>
                                </li>
                                <li class="col-lg-6">
                                    <span>Last Donation Date: </span>
                                    <div>{userData.LastDonationDate || "None of Donation"}</div>
                                </li>

                                <li class="col-lg-6">
                                    <span>Travel History : </span>
                                    <div>{#if userData.travelHistory === 'yes'}
                        Yes, I have a travel history
                      {:else if userData.travelHistory === 'no'}
                        No, I don't have a travel history
                      {/if} </div>
                                </li>

                                <li class="col-lg-6">
                                    <span>Risky Activities : </span>
                                    <div>{#if userData.riskyActivities === 'yes'}
                        Yes, I engage in risky activities
                      {:else if userData.riskyActivities === 'no'}
                      No, I don't engage in risky activities
                      {/if}</div>
                                </li>
                                <li class="col-lg-6">
                                    <span>Tattoos and Piercings : </span>
                                    <div>{#if userData.tattoosPiercings === 'yes'}
                        Yes, I have tattoos or piercings
                      {:else if userData.tattoosPiercings === 'no'}
                      No, I don't have tattoos or piercings
                      {/if}</div>
                                </li>
                                <li class="col-lg-6">
                                    <span>Social: </span>
                                    <div>
                                        <a href="{`https://www.facebook.com/${userData.facebook}`}" target="_blank" class="me-3"><i class="bi bi-facebook"></i></a>
                          <a href="{`https://instagram.com/${userData.instagram}`}" target="_blank" class="me-3"><i class="bi bi-instagram"></i></a>
                          <a href="{`https://twitter.com/${userData.twitter}`}" target="_blank" class="me-3"><i class="bi bi-twitter"></i></a>
                          <a href="{`https://www.linkedin.com/in/${userData.linkedin}`}" target="_blank"><i class="bi bi-linkedin"></i></a>
                                    </div>
                                </li>
                            </ul>

                            <div class="row">
  <div class="col-md-4" >
    <a style="background-color: #333333;" href="{`tel:+91${userData.phoneNumber}`}" class="btn-ten fw-500 text-white w-100 text-center tran3s mt-25">{callnow}</a>
  </div>
  <div class="col-md-4">
    <a style="background-color: #333333;" href="{`tel:+91${userData.phoneNumber}`}" class="btn-ten fw-500 text-white w-100 text-center tran3s mt-25">{callnow}</a>
  </div>
  <div class="col-md-4">
    <a style="background-color: #333333;" href="{`tel:+91${userData.phoneNumber}`}" class="btn-ten fw-500 text-white w-100 text-center tran3s mt-25">{callnow}</a>
  </div>
</div>

                        </div>
                    </div>
                 
                </div>
             
            </div>
        </div>
    </section>

    <Team />

</div>
