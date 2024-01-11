<script>
  import { onMount } from "svelte";
  import { getDatabase, ref, get, update, serverTimestamp  } from "firebase/database";
  import { auth } from "../../firebase";
  import { goto } from "@sapper/app";
  import Swal from "sweetalert2";

  import axios from "axios";
  import Toastify from "toastify-js";
  import toastr from "toastr";

  import { firebaseApp } from "../../firebase";

  const db = getDatabase(firebaseApp);

  let error = "";


  let pincode = "";
  let country = "India";
  let state = "";
  let division = "";
  let city = "";

  let area = "";

  let dropdownOptions = [];
  
  let user = {
    uid: "",
    name: "",
    gender: "",
    country: "",
    dateOfBirth: "",
    age: "",
    pincode: "",
    city: "",
    state: "",
    area: "",
    division: "",
    whatsappNum: "",
    email: "",
    bloodGroup: "",
    rhFactor: "",
    travelHistory: "",
    riskyActivities: "",
    tattoosPiercings: "",
  };

  function handleBloodGroupChange(event) {
    user.bloodGroup = event.target.value;

    
    if (user.bloodGroup.includes("+")) {
      user.rhFactor = "+ve";
    } else if (user.bloodGroup.includes("-")) {
      user.rhFactor = "-ve";
    } else {
   
      user.rhFactor =
        user.bloodGroup === "INRA" || user.bloodGroup === "Bombay Blood Group"
          ? "null"
          : "";
    }
  }

  function calculateAge() {
    if (user.dateOfBirth) {
      const dob = new Date(user.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();

      // Check if the birthday has occurred this year
      if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) {
        age--;
      }

      user.age = age;
    }
  }

  const handleDateChange = (event) => {
    user.dateOfBirth = event.target.value;
    user.age = calculateAge(user.dateOfBirth);
  };


  async function handlePincodeInput(event) {
    const input = event.target;
    let pincode = input.value; // Declare pincode using let
    if (pincode.length === 6) {
        await fetchAddressData(pincode); // Pass pincode as an argument
    } else {
        error = "Invalid pincode. Please enter a valid 6-digit pincode.";
    }
}

async function fetchAddressData(pincode) { // Accept pincode as a parameter
    try {
        const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
        const response = await axios.get(apiUrl);

        if (response.data.length > 0 && response.data[0].Status === "Success") {
            const postOffice = response.data[0].PostOffice[0];
            state = postOffice.State;
            division = postOffice.Name;
            city = postOffice.District;
            error = "";
            dropdownOptions = response.data[0].PostOffice.map(po => po.Name);
        } else {
            throw new Error("Invalid pincode. Please enter a valid 6-digit pincode.");
        }
    } catch (err) {
        error = err.message || "An error occurred while fetching data. Please try again.";
        Toastify({
            text: error,
            duration: 3000,
            gravity: 'top',
            position: 'left',
            backgroundColor: '#ff4d4d',
        }).showToast();
    }
}


  const loadUserData = async (uid) => {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    user = {
      uid: uid,
      name: userData?.fullName || "",
      gender: userData?.gender || "",
      country: userData?.country || "",
      dateOfBirth: userData?.dateOfBirth || "",
      age: userData?.age || "",
      phoneNumber: userData?.phoneNumber || "",
      pincode: userData?.pincode || "",
      city: userData?.city || "",
      state: userData?.state || "",
      area: userData?.area || "",
      division: userData?.division || "",
      whatsappNum: userData?.whatsapp || "",
      email: userData?.email || "",
      bloodGroup: userData?.bloodGroup || "",
      rhFactor: userData?.rhFactor || "",
      travelHistory: userData?.travelHistory || "",
      riskyActivities: userData?.riskyActivities || "",
      tattoosPiercings: userData?.tattoosPiercings || "",
      lddate: userData?.lddate || "",
      instagram: userData?.Instagram || "",
      facebook: userData?.Facebook || "",
      twitter: userData?.Twitter || "",
      linkedin: userData?.Linkedin || "",
    };
  };

  function getCurrentTimestamp() {
    const now = new Date();

  // Format time (hh:mm AM/PM)
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  const timeString = `${hours}:${minutes} ${ampm}`;

  // Format date (Day, MM/DD/YYYY)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[now.getDay()];
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  const dateString = `${dayOfWeek}, ${month}/${day}/${year}`;

  // Combine time and date
  const timestamp = `${timeString} ${dateString}`;

  return timestamp;
}

const timestamp = getCurrentTimestamp();

  onMount(async () => {

    
    const currentUser = auth.currentUser;

    if (!currentUser) {
      goto("/");
      return;
    }

    if (currentUser && currentUser.uid) {
      await loadUserData(currentUser.uid);
    }
  });

  const updateUser = async () => {
    if (!user || !user.uid) {
      return;
    }

    const userRef = ref(db, `users/${user.uid}`);

    const updatedUserData = {
      fullName: user.name,
      gender: user.gender,
      country: user.country,
      dateOfBirth: user.dateOfBirth,
      age: user.age,
      pincode: user.pincode,
      city: user.city,
      state: user.state,
      area: user.area,
      division: user.division,
      whatsapp: user.whatsappNum,
      email: user.email,
      bloodGroup: user.bloodGroup,
      phoneNumber: user.phoneNumber,
      rhFactor: user.rhFactor,
      travelHistory: user.travelHistory,
      riskyActivities: user.riskyActivities,
      tattoosPiercings: user.tattoosPiercings,
      LastDonationDate: user.lddate,
      Instagram: user.instagram,
      Facebook: user.facebook,
      Twitter: user.twitter,
      Linkedin: user.linkedin,
      lastUpdate : timestamp,
    };

    try {
      await update(userRef, updatedUserData);

      Swal.fire({
        icon: "success",
        title: "Data Updated Successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      goto(`/profile`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Updating Data",
        text: error.message,
      });
    }
  };

  let date = '';

  function getCurrentDateTime() {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    return currentDate.toLocaleString(undefined, options);
  }

  function updateDateTime() {
    date = getCurrentDateTime();
  }

  onMount(() => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    getOSDetails();
  });

  // Function to get browser information
  function getOSDetails() {
    const userAgent = window.navigator.userAgent;
    const osRegex = /(Windows|Macintosh|Linux|iPhone|iPad|Android)/i;
    const osMatch = userAgent.match(osRegex);
    osDetails = osMatch ? `${osMatch[0]} Operating System` : 'Operating System: Unknown';
  }

  function handleAreaSelect() {
    toastr.options = {
      closeButton: true,
      debug: true,
      newestOnTop: true,
      progressBar: true,
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
    };

    toastr.info('If you want to change your location details, please edit the pincode.', 'Notification');
  }
  

  let osDetails = '';
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
    integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <title>Account Settings</title>
</svelte:head>

<div class="main-page-wrapper">

 
  <div class="dashboard-body">

    
    <div class="position-relative">

     

<div class="membership-plan-wrapper mb-20">
    <div class="row gx-0">
        <div class="col-xxl-7 col-lg-6 d-flex flex-column">
            <div class="column w-100 h-100">
                <h4>Account Settings</h4>
                <p>User ID : {user.uid}</p>
            </div>
        </div>
        <div class="col-xxl-5 col-lg-6 d-flex flex-column">
            <div class="column border-left w-100 h-100">
                <div class="d-flex">
                    
                    <div class="ps-4 flex-fill">
                        
                        <span class="text1 d-block">{date}</span>
                        <span class="text1 d-block">{osDetails}</span>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



      <div class="bg-white card-box border-20">
        <h4 class="dash-title-three">Gendral Information</h4>
        <form action="#">
          <div class="row">
            <div class="col-lg-6">
              <div class="dash-input-wrapper mb-20">
                <label for="">Name</label>
                <input type="text" id="name" bind:value={user.name} />
              </div>
              <!-- /.dash-input-wrapper -->
            </div>
            <div class="col-lg-6">
              <div class="dash-input-wrapper mb-20">
                <label for="">Gender</label>
                <input type="text" placeholder="" bind:value={user.gender} />
              </div>
              <!-- /.dash-input-wrapper -->
            </div>

            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20">
                <label for="">Date of Birth</label>
                <input
                  type="date"
                  placeholder=""
                  bind:value={user.dateOfBirth}
                  on:change={calculateAge}
                />
              </div>
              <!-- /.dash-input-wrapper -->
            </div>
            <div class="col-lg-3">
              <div class="dash-input-wrapper mb-20">
                <label for="">Age</label>
                <input type="text" placeholder="" bind:value={user.age} readonly/>
              </div>
              <!-- /.dash-input-wrapper -->
            </div>
            <div class="col-lg-5">
              <div class="dash-input-wrapper mb-20">
                <label for="">Pincode</label>
                <input
                  type="text"
                  on:input={handlePincodeInput}
                  inputmode="numeric"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                  minlength="5"
                  maxlength="6"
                  pattern="[0-9]*"
                  bind:value={user.pincode}
                />
              </div>
              <!-- /.dash-input-wrapper -->
            </div>
            {#if error}
              <div class="alert alert-warning" role="alert">
                {error}
              </div>
            {:else}
              <div class="col-lg-4">
                <div class="dash-input-wrapper mb-20">
                  <label for="country">Country</label>
                  <input
                    type="text"
                    disabled
                    placeholder="Country"
                    bind:value={user.country}
                    autocomplete="off"
                  />
                </div>
              </div>

              <div class="col-lg-4">
                <div class="dash-input-wrapper mb-20">
                  <label for="state">State</label>
                  <input
                    type="text"
                    disabled
                    placeholder="State"
                    bind:value={user.state}
                    autocomplete="off"
                  />
                </div>
              </div>

              <div class="col-lg-4">
  <div class="dash-input-wrapper mb-20">
    <label for="state">Area</label>
    <select bind:value={user.area} on:click={handleAreaSelect}>
      {#if user.area}
        <option value={user.area}>{user.area}</option>
      {/if}
      <option value="" disabled hidden style="display:none">
        Select your Area!
      </option>
      {#each dropdownOptions as option (option)}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
</div>



              <div class="col-12">
                <div class="dash-input-wrapper mb-20">
                  <label for="city">City</label>
                  <input
                    type="text"
                    disabled
                    placeholder="City"
                    bind:value={user.city}
                    autocomplete="off"
                  />
                </div>
              </div>

              
            {/if}

            <h4 class="dash-title-three">Contact Information</h4>
            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20">
                <label for="phoneNumber">Email*</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  bind:value={user.email}
                  autocomplete="off"
                />
              </div>
            </div>

            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20">
                <label for="phoneNumber">Phone Number*</label>
                <input
                  type="tel"
                  maxlength="10"
                  minlength="10"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                  placeholder="Enter your Phone Number"
                  bind:value={user.phoneNumber}
                  autocomplete="off"
                />
              </div>
            </div>

            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20">
                <label for="phoneNumber">WhatsApp Number*</label>
                <input
                  type="tel"
                  maxlength="10"
                  minlength="10"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                  placeholder="Enter your Phone Number"
                  bind:value={user.whatsappNum}
                  autocomplete="off"
                />
              </div>
            </div>
            <h4 class="dash-title-three">Blood Information</h4>
            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20">
                <label for="country">Blood Group</label>
                <select
                  bind:value={user.bloodGroup}
                  on:change={handleBloodGroupChange}
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
                  <option value="Bombay Blood Group">Bombay Blood Group</option>
                  <option value="INRA">INRA</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20">
                <label for="phoneNumber">Rh Factor (+/-) </label>
                <input type="text" id="rhFactor" bind:value={user.rhFactor} p />
              </div>
            </div>

            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20">
                <label for="phoneNumber"
                  >Last Donation Date <span style="color: green;"
                    >(optional)</span
                  >
                </label>
                <input type="date" bind:value={user.lddate} p />
              </div>
            </div>

            <!-- Travel History -->
            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20 custom-radio">
                <label>
                  <input
                    type="radio"
                    name="travel_history"
                    value="yes"
                    bind:group={user.travelHistory}
                  />
                  <span class="checkmark" />
                  Yes, I have a travel history
                </label>

                <label>
                  <input
                    type="radio"
                    name="travel_history"
                    value="no"
                    bind:group={user.travelHistory}
                  />
                  <span class="checkmark" />
                  No, I don't have a travel history
                </label>
              </div>
            </div>

            <!-- Risky Activities -->
            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20 custom-radio">
                <label>
                  <input
                    type="radio"
                    name="risky_activities"
                    value="yes"
                    bind:group={user.riskyActivities}
                  />
                  <span class="checkmark" />
                  Yes, I engage in risky activities
                </label>

                <label>
                  <input
                    type="radio"
                    name="risky_activities"
                    value="no"
                    bind:group={user.riskyActivities}
                  />
                  <span class="checkmark" />
                  No, I don't engage in risky activities
                </label>
              </div>
            </div>

            <!-- Tattoos and Piercings -->
            <div class="col-lg-4">
              <div class="dash-input-wrapper mb-20 custom-radio">
                <label>
                  <input
                    type="radio"
                    name="tattoos_piercings"
                    value="yes"
                    bind:group={user.tattoosPiercings}
                  />
                  <span class="checkmark" />
                  Yes, I have tattoos or piercings
                </label>

                <label>
                  <input
                    type="radio"
                    name="tattoos_piercings"
                    value="no"
                    bind:group={user.tattoosPiercings}
                  />
                  <span class="checkmark" />
                  No, I don't have tattoos or piercings
                </label>
              </div>
            </div>
            
            <h4 class="dash-title-three">Social Media Handles</h4>
            <span class="mt-10 mb-15 text1 d-block"><span style="color:red;">Simply enter your username without the "@" symbol</span></span>

            <div class="col-lg-3">
              <div class="dash-input-wrapper mb-20">
                <label for="">Instagram</label>
                <input type="text" id="name" bind:value={user.instagram} />
              </div>
              <!-- /.dash-input-wrapper -->
            </div>
            <div class="col-lg-3">
              <div class="dash-input-wrapper mb-20">
                <label for="">Facebook</label>
                <input type="text" id="name" bind:value={user.facebook} />
              </div>
              <!-- /.dash-input-wrapper -->
            </div>
            <div class="col-lg-3">
              <div class="dash-input-wrapper mb-20">
                <label for="">Twitter (X)</label>
                <input type="text" id="name" bind:value={user.twitter} />
              </div>
              <!-- /.dash-input-wrapper -->
            </div>
            <div class="col-lg-3">
              <div class="dash-input-wrapper mb-20">
                <label for="">LinkedIn</label>
                <input type="text" id="name" bind:value={user.linkedin} />
              </div>
              <!-- /.dash-input-wrapper -->
            </div>
          </div>

          <div class="button-group d-inline-flex align-items-center mt-30">
            <a
              href
              on:click={updateUser}
              class="dash-btn-two tran3s me-3 rounded-3"
            >
              Update <i class="fa-solid fa-paper-plane" /></a
            >
            <a href="/" class="dash-cancel-btn tran3s"
              >Cancel <i class="fa-solid fa-xmark" />
            </a>
          </div>
        </form>
      </div>
      <!-- /.card-box -->
    </div>
  </div>
</div>



<style>
  .dashboard-body {
    min-height: 100vh;
    background: #f0f5f3;
    margin-left: 0 !important;
    border-radius: 0px 0 0 0px !important;
    padding: 150px 10px 50px;
  }

  select {
    width: 100%;
    height: 55px;
    letter-spacing: -0.16px;
    border: 1px solid #e5e5e5;
    border-radius: 7px;
    padding: 0 20px;
    font-size: 16px;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    outline: none;
    /* Add any other styling as needed */
  }

  /* Styling for the arrow icon in the select box */
  select::after {
    content: "\25BC"; /* Unicode character for a down arrow */
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    pointer-events: none; /* Ensure the arrow doesn't interfere with the select interaction */
  }

  .custom-radio label {
    position: relative;
    display: block;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 16px;
  }

  .custom-radio input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
  }

  .custom-radio input:checked ~ .checkmark:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background-color: #2196f3;
    border-radius: 50%;
    display: block;
  }

  .custom-radio label:hover {
    background-color: #f5f5f5;
  }
</style>