<script>


  import Banner from "../../components/InnerBanner.svelte";
  import { getDatabase, ref, get, set } from "firebase/database";
import { onMount } from 'svelte';
import { initializeApp } from 'firebase/app';

import { firebaseApp } from "../../firebase";
import toastr from "toastr";

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-bottom-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
  };

const noimage = {
    img : "./images/no-data-pana.svg"
}

const db = getDatabase(firebaseApp);
let pincode;
let country = "India";
  let state = "";
  let division = "";
  let city = "";
  let error = "";
  let bloodGroup = "";
  let filteredData = [];

  import { goto } from '@sapper/app';

  function viewUserProfile(uid) {
    event.preventDefault();
let a = uid
    console.log('UID before goto:', uid); // Log to check the value

    // Use goto to navigate to the user's profile page and include uid in the state
    goto(`donor/${uid}`, { state: { value: uid } });
  }




  const applyFilter = async (event) => {

    


    event.preventDefault(); // Prevent the default behavior of the anchor tag

    if (
    
    !pincode ||
   
    !bloodGroup 
    
  ) {
    toastr.error("Please fill in all required fields.");
    return;
  }
    try {
      const snapshot = await get(ref(db, 'users'));

      filteredData = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();

        // Apply your filtering logic here
        if (data.pincode === pincode && data.bloodGroup === bloodGroup) {
          filteredData.push({
            uid: data.uid,
            fullName: data.fullName,
            age: data.age,
            gender: data.gender,
            email: data.email,
            phoneNumber: data.phoneNumber,
            whatsapp: data.whatsapp
          });
        }
      });

      // Update the count of filtered results
      noofresults = filteredData.length;

      // Log the filtered data
      console.log(filteredData.uid);
    } catch (err) {
      error = err.message || 'Error fetching data from Firebase';
    }
  };

  // Reactively update the count when filteredData changes
  $: noofresults = filteredData.length;

  onMount(() => {
    // Optionally, you can fetch initial data on component mount
    applyFilter();
  });

  async function handlePincodeInput(event) {
    const input = event.target;
    pincode = input.value; // Update the pincode

    if (pincode.length === 6) {
      await fetchAddressData(); // Fetch address data when 6 digits are entered
    } else {
      resetAddressData(); // Reset address data when pincode is invalid
    }
  }

  let selectedOption = '';
  let dropdownOptions = [];
  

  async function fetchAddressData() {
    try {
      const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Invalid pincode. Please enter a valid 6-digit pincode.");
      }

      const data = await response.json();

      if (data.length > 0 && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        state = postOffice.State;
        division = postOffice.Division;
        city = postOffice.Name;
        dropdownOptions = data[0].PostOffice.map(po => po.Name);
        error = ""; // Reset the error if data is fetched successfully
      } else {
        throw new Error("Invalid pincode. Please enter a valid 6-digit pincode.");
      }
    } catch (err) {
      resetAddressData(); // Reset address data if an error occurs
      error = err.message || "An error occurred while fetching data. Please try again.";
    }
  }

  function resetAddressData() {
    state = "";
    division = "";
    city = "";
    dropdownOptions = [];
    error = "";
  }
</script>






<div class="main-page-wrapper">
  <div>
    <Banner title="Search blood donors near you using a pincode" />
  </div>


  <section class="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
    <div class="container">
              <div class="row">
                  <div class="col-12">
                      <div class="filter-area-tab">
                          <div class="light-bg border-20 ps-4 pe-4">
                              <a class="filter-header border-20 d-block collapsed" data-bs-toggle="collapse" href="#collapseFilterHeader" role="button" aria-expanded="false"><span class="main-title fw-500 text-dark">Search Donors By</span></a>
                             
                              <div class="border-top collapse" id="collapseFilterHeader" style="">
                                  <div class="pt-25 pb-30">
                                      <div class="row">
                                          
                                          <div class="col-lg-4 col-sm-6">
                                              <div class="filter-block pb-50 lg-pb-20">
                                                  <div class="filter-title fw-500 text-dark">Pincode <i class="bi bi-signpost"></i></div>
                                                 
                                                  <input
                                                  style="
                                                    width: 100%;
                                height: 55px;
                                font-size: 16px;
                                border: 1px solid rgba(0, 0, 0, .06);
                                border-radius: 8px;
                                padding: 0 52px 0 20px;
                                color: #000;
                                background: rgba(49, 121, 90, .09);
                                                    "
                                                  type="text "
                                                  on:input={handlePincodeInput}
                                                  inputmode="numeric"
                                                  oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                                                  minlength="5"
                                                  maxlength="6"
                                                  pattern="[0-9]*"
                                                  placeholder="Enter your Pincode"
                                                  bind:value={pincode}
                                                  autocomplete="off"
                                                />
                                                  </div>
                                              <!-- /.filter-block -->
                                          </div>
                                          <div class="col-lg-4 col-sm-6">
                                              <div class="filter-block pb-50 lg-pb-20">
                                                  <div class="filter-title fw-500 text-dark">Searching Location <i class="bi bi-radar"></i></div>
                                                  <ul class="style-none filter-input">
                                                    <select  style="
                                                    width: 100%;
                height: 55px;
                font-size: 16px;
                border: 1px solid rgba(0, 0, 0, .06);
                border-radius: 8px;
                padding: 0 52px 0 20px;
                color: #000;
                background: rgba(49, 121, 90, .09);
                                                    "
                                                  
                                                    bind:value={selectedOption}>
                                                      <option disabled hidden style="display:none" value="">Select your Area!</option>
                                                      {#each dropdownOptions as option (option)}
                                                        <option value={option}>{option}</option>
                                                      {/each}
                                                    </select>
                                                  
                                                    {#if error}
                                                      <p>{error}</p>
                                                    {/if}
                                                  
                                                  
                                              
                                                </div>
                                              <!-- /.filter-block -->
                                          </div>
                                          <div class="col-lg-4 col-sm-6">
                                              <div class="filter-block pb-50 lg-pb-20">
                                                  <div class="filter-title fw-500 text-dark">Blood Group <i class="bi bi-droplet"></i></div>
                                                  <select
                        style="
                                          width: 100%;
      height: 55px;
      font-size: 16px;
      border: 1px solid rgba(0, 0, 0, .06);
      border-radius: 8px;
      padding: 0 52px 0 20px;
      color: #000;
      background: rgba(49, 121, 90, .09);
                                          "
                        bind:value={bloodGroup}
                        class="form-select"
                        id="id3"
                        name="bloodGroupType"
                        required
                      >
                        <option disabled hidden style="display:none" value=""
                          >Choose... Blood</option
                        >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="A1+">A1+</option>
                        <option value="A1-">A1-</option>
                        <option value="A1B+">A1B+</option>
                        <option value="A1B-">A1B-</option>
                        <option value="A2+">A2+</option>
                        <option value="A2-">A2-</option>
                        <option value="A2B+">A2B+</option>
                        <option value="A2B-">A2B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="Bombay Blood Group"
                          >Bombay Blood Group</option
                        >
                        <option value="INRA">INRA</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                                                  
                                                  
                                              
                                                </div>
                                              <!-- /.filter-block -->
                                          </div>
                                      </div>
  
      
                                      <div class="row">
                                          <div class="col-xl-2 m-auto">
                                              <a href
                                              on:click={applyFilter} class="btn-ten fw-500 text-white w-100 text-center tran3s mt-30 md-mt-10">Apply Filter</a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <!-- /.filter header -->
                          </div>
                      </div>
                      <!-- /.filter-area-tab -->
                  </div>
  
  
       
        <!-- /.col- -->
              </div>
          </div>
  </section>


  <section class="candidates-profile bg-color pt-90 lg-pt-70 pb-160 xl-pb-150 lg-pb-80">
    <div class="container">
      <div class="row">
      




        <div class="col-xl-12 col-lg-8">
            <!-- <div class="total-job-found">All <span class="text-dark">{noofresults}</span> Results found</div> -->

            <div style="
            padding: 1.4rem 0rem;" class="total-job-found md-mt-10">All <span class="text-dark fw-500">{noofresults}</span> Donors found</div>
                                

            <div class="ms-xxl-5 ms-xl-3">
                
                <div class="accordion-box grid-style show">
                    <div class="row">
                    
                        
                        {#each filteredData as {uid, fullName, age, gender, email, phoneNumber, whatsapp }}

                        <div class="col-xxl-3 col-lg-4 col-sm-6 d-flex">
                          <div class="candidate-profile-card text-center grid-layout border-0 mb-25">
                              <a href on:click={() => viewUserProfile(uid)} class="save-btn tran3s"><i class="bi bi-heart"></i></a>
                              
                              <h4 class="candidate-name mt-15 mb-0"><a href on:click={() => viewUserProfile(uid)} class="tran3s">{fullName}</a></h4>
                             <div class="candidate-post">{age} | {gender}</div>
                             <ul style="align-self: center;" class="cadidate-skills style-none d-flex flex-wrap align-items-center justify-content-center justify-content-md-between pt-30 sm-pt-20 pb-10">
                                  <li>{email}</li>
                                  
                             </ul>
                             <!-- /.cadidate-skills -->
                             <div class="row gx-1">
                                  <div class="col-md-6">
                                      <div class="candidate-info mt-10">
                                        <span>Phone</span>
                                        <div>{phoneNumber}</div>
                                      </div>
                                      <!-- /.candidate-info -->
                                  </div>
                                  <div class="col-md-6">
                                      <div class="candidate-info mt-10">
                                        <span>Whatsapp</span>
                                        <div>{whatsapp}</div>
                                      </div>
                                      <!-- /.candidate-info -->
                                  </div>
                             </div>
                             <div class="row gx-2 pt-25 sm-pt-10">
                                  <div class="col-md-12">
                                      <a href on:click={() => viewUserProfile(uid)} class="profile-btn tran3s w-100 mt-5">View Profile</a>
                                  </div>
                                  
                                 </div>
                          </div> 
                          <!-- /.candidate-profile-card -->
                      </div>


                      <!-- Dummy 01 -->
   
  {/each}

  {#if filteredData.length === 0}
  <img src="{noimage.img}" alt="No data found" class="center-image" />
    <p>No matching data found.</p>
  {/if}

  {#if error}
    <p>{error}</p>
  {/if}
                    
                    </div>
                </div>
                <!-- /.accordion-box -->

              


               
            </div>
           
       
        </div>
        <!-- /.col- -->
      </div>
    </div>
  </section>
</div>
