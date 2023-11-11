<script>
  import { onMount } from "svelte";
  import { getDatabase, ref, get, update } from "firebase/database";
  import { auth } from "../../firebase";
  import { goto } from "@sapper/app";
  import Swal from "sweetalert2";
  import { firebaseApp } from "../../firebase";

  const db = getDatabase(firebaseApp);

  let error = "";

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

    // If the selected blood group is Rh factor relevant, initialize the Rh factor to an empty string
    // Otherwise, set it to null
    if (user.bloodGroup.includes("+")) {
      user.rhFactor = "+ve";
    } else if (user.bloodGroup.includes("-")) {
      user.rhFactor = "-ve";
    } else {
      // For other blood groups, set rhFactor to null or an empty string
      user.rhFactor =
        user.bloodGroup === "INRA" || user.bloodGroup === "Bombay Blood Group"
          ? "null"
          : "";
    }
  }

  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    // Check if the birthday has occurred this year
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) {
      age--;
    }

    return age;
  }

  const handleDateChange = (event) => {
    user.dateOfBirth = event.target.value;
    user.age = calculateAge(user.dateOfBirth);
  };

  async function handlePincodeInput(event) {
    const input = event.target;
    user.pincode = input.value;

    if (user.pincode.length === 6) {
      await fetchAddressData();
    } else {
      error = "Invalid pincode. Please enter a valid 6-digit pincode.";
    }
  }

  async function fetchAddressData() {
    if (user.pincode.length === 6) {
      try {
        const apiUrl = `https://api.postalpincode.in/pincode/${user.pincode}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(
            "Invalid pincode. Please enter a valid 6-digit pincode."
          );
        }

        const data = await response.json();

        if (data.length > 0 && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          user.state = postOffice.State;
          user.division = postOffice.Division;
          user.city = postOffice.Name;
          error = "";
        } else {
          throw new Error(
            "Invalid pincode. Please enter a valid 6-digit pincode."
          );
        }
      } catch (err) {
        error =
          err.message ||
          "An error occurred while fetching data. Please try again.";
      }
    } else {
      error = "";
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
      division: userData?.division || "",
      whatsappNum: userData?.whatsapp || "WhatsApp Number",
      email: userData?.email || "",
      bloodGroup: userData?.bloodGroup || "",
      rhFactor: userData?.rhFactor || "",
      travelHistory: userData?.travelHistory || "",
      riskyActivities: userData?.riskyActivities || "",
      tattoosPiercings: userData?.tattoosPiercings || "",
      lddate: userData?.lddate || "",
      instagram: userData?.instagram || "",
      facebook: userData?.facebook || "",
      twitter: userData?.twitter || "",
      linkedin: userData?.linkedin || "",
    };
  };

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
      <h2 class="main-title px-3">Account Settings</h2>

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
                />
              </div>
              <!-- /.dash-input-wrapper -->
            </div>
            <div class="col-lg-3">
              <div class="dash-input-wrapper mb-20">
                <label for="">Age</label>
                <input type="text" placeholder="" bind:value={user.age} />
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
                  <label for="state">Division</label>
                  <input
                    type="text"
                    disabled
                    placeholder="Division"
                    bind:value={user.division}
                    autocomplete="off"
                  />
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
