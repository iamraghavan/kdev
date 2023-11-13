<script>
  import { onMount } from "svelte";
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { getDatabase, ref, set } from "firebase/database";
  import { updateProfile, sendEmailVerification } from "firebase/auth";
  import Swal from "sweetalert2";
  import { goto } from "@sapper/app";

  import { firebaseApp } from "../firebase";

  const auth = getAuth(firebaseApp);
  const db = getDatabase(firebaseApp);

  let email = "";
  let password = "";
  let fullName = "";
  let gender = "";
  let bloodGroup = "";
  let dateOfBirth = "";
  let phoneNumber = "";
  let pincode = "";
  let country = "India"; // Default country
  let state = "";
  let division = "";
  let city = "";
  let error = "";
  let isSubmitDisabled = true;
  let isBelow18 = false;
  let age;

  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    age = today.getFullYear() - dob.getFullYear();

    // Check if the birthday has occurred this year
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) {
      age--;
    }
    isSubmitDisabled = age < 18;
    isBelow18 = age < 18;
  }

  function handleDateChange(event) {
    dateOfBirth = event.target.value;
    calculateAge(dateOfBirth);
  }

  async function handlePincodeInput(event) {
    const input = event.target;
    pincode = input.value; // Update the pincode

    if (pincode.length === 6) {
      await fetchAddressData(); // Fetch address data when 6 digits are entered
    } else {
      error = "Invalid pincode. Please enter a valid 6-digit pincode.";
    }
  }

  async function fetchAddressData() {
    if (pincode.length === 6) {
      try {
        const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(
            "Invalid pincode. Please enter a valid 6-digit pincode."
          );
        }

        const data = await response.json();

        if (data.length > 0 && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          state = postOffice.State;
          division = postOffice.Division;
          city = postOffice.Name;
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
      error = ""; // Reset the error if the pincode is not 6 digits
    }
  }

  let showPassword = false;
  let passwordStrength = "Weak";
  let showSuccessAlert = false;

  function checkPasswordStrength() {
    // Define a regular expression for a strong password (e.g., at least 8 characters, including upper case, lower case, and numbers)
    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (strongPasswordRegex.test(password)) {
      passwordStrength = "Strong";
      showSuccessAlert = true;
    } else {
      passwordStrength = "Weak";
      showSuccessAlert = false;
    }
  }

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  function initializeTurnstile() {
    if (window.turnstileV2 && window.turnstileV2.callback) {
      window.turnstileV2.callback(
        {
          sitekey: '0x4AAAAAAACC60E1r0uX5QL4',
          action: 'registration',
          // Additional parameters if needed
        },
        handleRegistration
      );
    } else {
      setTimeout(initializeTurnstile, 500); // Retry after 500 milliseconds
    }
  }

  async function handleRegistration() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Generate a unique UID for the user
      const uid = user.uid;

      // Store user data in the Realtime Database
      const userRef = ref(db, "users/" + uid);
      const timestamp = new Date();
      const formattedTimestamp = `${timestamp.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })} ${timestamp.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        weekday: "long",
      })}`;

      const userData = {
        uid: uid,
        email: email,
        fullName: fullName,
        gender: gender,
        bloodGroup : bloodGroup,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        pincode: pincode,
        city: city,
        state: state,
        age: age,
        country: country,
        division: division,

        created_at: formattedTimestamp,
        updated_at: formattedTimestamp,
      };

      await set(userRef, userData);

      // Update the user's display name
      await updateProfile(user, {
        displayName: fullName,
      });

      // Send email verification
      await sendEmailVerification(user);

      // Show a success message with SweetAlert
      Swal.fire({
        icon: "success",
        title: "🎉 Registration Successful 🎉",
        html: `
        <p>Thank you for being a superhero!</p>
        <p>Your blood donation will save lives, and we can't thank you enough.</p>
        <p>Get ready to wear your cape (or bandage) with pride! 💪🩸</p>
      `,
        showConfirmButton: false, // Remove the OK button
        timer: 7000, // Show the message for 7 seconds (7000 milliseconds)
      });

      // Use setTimeout to redirect after 7 seconds
      setTimeout(() => {
        goto("/login"); // Redirect to the login page
      }, 7000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }
  }

  let alertColor = "black";

  import Banner from "../components/InnerBanner.svelte";
  import InformationOne from "../components/InformationOne.svelte";
  // import Banner from "../Components/InnerBanner.svelte";

  let pageLinks = [{ text: "Home", url: "/" }, { text: "Registration" }];

  onMount(() => {
    const inputFields = document.querySelectorAll('input[autocomplete="off"]');
    inputFields.forEach((input) => {
      input.setAttribute("autocomplete", "new-password");
    });
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />

  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<!-- Add your styles here -->




<div class="main-page-wrapper">
  <div>
    <Banner title="Donor Candidates Registration" />
    <!-- Other content for the "About" page -->
  </div>

  <section
    class="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80"
  >
    <div class="container">
      <div class="user-data-form">
        <div class="text-center">
          <h2>Create Account</h2>
        </div>
        <div class="form-wrapper m-auto">
          <div class="tab-content mt-40">
            <div class="tab-pane fade show active" role="tabpanel" id="fc1">
              <form>
                <div class="row">
                  <div class="col-12">
                    <div class="input-group-meta position-relative mb-25">
                      <label for="fullName">Name*</label>
                      <input
                        type="text"
                        placeholder="Enter your Name"
                        bind:value={fullName}
                        autocomplete="off"
                      />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="gender-radio-group">
                      <label for="gender">Gender*</label>
                      <div class="radio-option">
                        <input
                          type="radio"
                          id="male"
                          name="gender"
                          value="male"
                          bind:group={gender}
                          autocomplete="off"
                        />
                        <label for="male">
                          <i class="fas fa-mars" />
                          <!-- Font Awesome male icon -->
                          Male
                        </label>
                      </div>

                      <div class="radio-option">
                        <input
                          type="radio"
                          id="female"
                          name="gender"
                          value="female"
                          bind:group={gender}
                          autocomplete="off"
                        />
                        <label for="female">
                          <i class="fas fa-venus" />
                          <!-- Font Awesome female icon -->
                          Female
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="input-group-meta position-relative mb-25">
                      <label for="country">Blood Group</label>
                      <select
                      bind:value={bloodGroup}
                        class="form-select"
                        id="id3"
                        name="bloodGroupType"
                        required
                      >
                      <option disabled hidden style="display:none" value="">Choose... Blood</option>
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
                  </div>

                  <div class="col-12">
                    <div class="input-group-meta position-relative mb-25">
                      <label for="dateOfBirth">Date of Birth*</label>
                      {#if age > 18}
                        <p>{age} years, and you're rocking it! 🎉</p>
                      {/if}
                      <input
                        type="date"
                        on:input={handleDateChange}
                        bind:value={dateOfBirth}
                        autocomplete="off"
                      />
                    </div>
                  </div>
                  {#if isBelow18}
                    <div class="alert alert-warning" role="alert">
                      Oops! We love your energy, but our <span
                        style="color:red; font-weight:bold;">kurudhi.com</span
                      > community is strictly for 18 and above. Check back when you're
                      a year wiser! 🎂🎉
                    </div>
                  {:else}
                    <div class="col-12">
                      <div class="input-group-meta position-relative mb-25">
                        <label for="phoneNumber">Phone Number*</label>
                        <input
                          type="tel"
                          maxlength="10"
                          minlength="10"
                          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                          placeholder="Enter your Phone Number"
                          bind:value={phoneNumber}
                          autocomplete="off"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="input-group-meta position-relative mb-25">
                        <label for="cpassword">Pincode</label>
                        <input
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
                    </div>
                    {#if error}
                      <div class="alert alert-warning" role="alert">
                        {error}
                      </div>
                    {:else}
                      <div class="col-12">
                        <div class="input-group-meta position-relative mb-25">
                          <label for="country">Country</label>
                          <input
                            type="text"
                            disabled
                            placeholder="Country"
                            bind:value={country}
                            autocomplete="off"
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="input-group-meta position-relative mb-25">
                          <label for="state">State</label>
                          <input
                            type="text"
                            disabled
                            placeholder="State"
                            bind:value={state}
                            autocomplete="off"
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="input-group-meta position-relative mb-25">
                          <label for="state">Division</label>
                          <input
                            type="text"
                            disabled
                            placeholder="Division"
                            bind:value={division}
                            autocomplete="off"
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="input-group-meta position-relative mb-25">
                          <label for="city">City</label>
                          <input
                            type="text"
                            disabled
                            placeholder="City"
                            bind:value={city}
                            autocomplete="off"
                          />
                        </div>
                      </div>
                    {/if}
                    <div class="col-12">
                      <div class="input-group-meta position-relative mb-25">
                        <label for="phoneNumber">Email*</label>
                        <input
                          type="email"
                          placeholder="Enter your Email"
                          bind:value={email}
                          autocomplete="off"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="input-group-meta position-relative mb-20">
                        <label for="password"
                          >Password* <span
                            class="password-strength {passwordStrength ===
                            'Strong'
                              ? 'strong-password'
                              : ''}">{passwordStrength}</span
                          ></label
                        >
                        {#if showPassword}
                          <input
                            type="text"
                            placeholder="Enter Password"
                            bind:value={password}
                            on:input={checkPasswordStrength}
                            autocomplete="off"
                          />
                        {:else}
                          <input
                            type="password"
                            placeholder="Enter Password"
                            bind:value={password}
                            autocomplete="off"
                          />
                        {/if}
                        <div class="mt-3">
                          <button
                            type="button"
                            class="toggle-password"
                            on:click={togglePasswordVisibility}
                          >
                            {showPassword ? "Hide Password" : "Show Password"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {#if showSuccessAlert}
                      <div
                        class="alert alert-info alert-dismissible fade show"
                        role="alert"
                      >
                        Congratulations! Your password is hacker-proof. 🚀💪
                        <button
                          style="padding: 6px 4px;"
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="alert"
                          aria-label="Close"
                        />
                      </div>
                    {/if}

                    <div class="col-12">
                    <div class="agreement-checkbox d-flex justify-content-between align-items-center">
                      <div>
                        <div class="cf-turnstile" data-sitekey="0x4AAAAAAACC60E1r0uX5QL4" data-theme="light" data-callback="initializeTurnstile"></div>
                      </div>
                    </div>
                  </div>

                    <div class="col-12">
                      <button
                        type="button"
                        class="btn-eleven fw-500 tran3s d-block mt-20"
                        on:click={handleRegistration}>Register</button
                      >
                    </div>
                  {/if}
                </div>
              </form>
            </div>
          </div>

          <div class="d-flex align-items-center mt-30 mb-10">
            <div class="line" />
            <span class="pe-3 ps-3">OR</span>
            <div class="line" />
          </div>

          <p class="text-center mt-10">
            Have an account? <a href="/login">Login</a>
          </p>
        </div>
        <!-- /.form-wrapper -->
      </div>
      <!-- /.user-data-form -->
    </div>

    <div class="mt-50 rounded container text-black" style="text-align:justify;">
      <div class="position-relative">
        <div class="row px-lg-5 px-auto pt-3">
          <InformationOne {alertColor} />
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .gender-radio-group {
    display: flex;
    flex-direction: column;
  }

  .radio-option {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }

  .radio-option input[type="radio"] {
    display: none; /* Hide the default radio input */
  }

  .radio-option label {
    cursor: pointer;
    user-select: none;
    padding-left: 25px;
    position: relative;
  }

  .radio-option label i {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 10px;
    font-size: 20px;
    font-weight: bold;
  }

  .radio-option input[type="radio"]:checked + label {
    font-weight: bold;
    color: #ff69b4; /* Pink color for female */
  }

  .radio-option input[type="radio"]:checked[value="male"] + label {
    color: #007bff; /* Blue color for male */
  }

  .password-strength {
    font-weight: bold;
    color: var(--password-strength-color, red);
  }

  .strong-password {
    color: green; /* Set the color to green for a strong password */
  }

  /* Style the select container */

  select {
  width: 100%;
  height: 55px;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 0 52px 0 20px;
  color: #000;
  background: rgba(49, 121, 90, 0.09);
  appearance: none; /* Remove default styles (e.g., arrow) in some browsers */
}

/* Style for the arrow icon in select */
select::after {
  content: '\25BC'; /* Unicode character for a down arrow */
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  font-size: 20px;
  color: #000;
  pointer-events: none; /* Ensure the arrow doesn't interfere with select interaction */
}
</style>
