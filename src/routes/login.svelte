<script>
  import { onMount } from 'svelte';
  import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
  } from 'firebase/auth';
  import { getDatabase, ref, get, set } from 'firebase/database';
  import Swal from 'sweetalert2';
  import { goto } from '@sapper/app';
  import { v4 as uuidv4 } from 'uuid';
  import { firebaseApp } from '../firebase';
  import Banner from "../components/InnerBanner.svelte";

  const auth = getAuth(firebaseApp);
  const db = getDatabase(firebaseApp);

  let rememberMe;
  let email = '';
  let password = '';
  let showPassword = false;
  let fingerprint;

  let otp = '';
let otpInput = '';

  onMount(async () => {
    const inputFields = document.querySelectorAll('input[autocomplete="off"]');
    inputFields.forEach((input) => {
      input.setAttribute('autocomplete', 'new-password');
    });

    // Check if the user is already logged in from another device
    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkExistingSession(user.uid);
      }
    });

    // Generate fingerprint
    fingerprint = generateFingerprint();
  });

  const generateFingerprint = () => {
    // Check if a fingerprint is already stored in local storage
    const storedFingerprint = localStorage.getItem('userFingerprint');

    if (storedFingerprint) {
      return storedFingerprint;
    }

    const userAgent = window.navigator.userAgent;
    const screenResolution = window.screen.width + 'x' + window.screen.height;
    const language = window.navigator.language;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const platform = window.navigator.platform;
    const plugins = Array.from(navigator.plugins).map((plugin) => plugin.name);

    const combinedInfo = userAgent + screenResolution + language + timeZone + platform + plugins;

    // Use uuid to generate a unique ID
    const visitorId = uuidv4();

    // Store the fingerprint in local storage
    localStorage.setItem('userFingerprint', visitorId);
    console.log(visitorId);

    return visitorId;
  };

  const checkExistingSession = async (userId) => {
    try {
      // Check if the user has an existing session
      const userSessionRef = ref(db, `users/${userId}/userSessions`);
      const existingSession = await get(userSessionRef);

      if (existingSession && existingSession.val().fingerprint !== fingerprint) {
        // User is already logged in from another device
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: 'You are already logged in from another device.',
        });

        // Sign out the current user
        await signOut(auth);

        // Redirect to a login page or perform any other action
        goto('/login');
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
    }
  };

  // const handleLogin = async () => {
  //   try {
  //     // Log in the user
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);

  //     // Store the user's session in the database
  //     const userSessionRef = ref(db, `users/${userCredential.user.uid}/userSessions`);
  //     await set(userSessionRef, {
  //       fingerprint,
  //       userAgent: window.navigator.userAgent,
  //       platform: window.navigator.platform,
  //     });

  //     // Check if "Keep me logged in" is selected
  //     if (rememberMe) {
  //       localStorage.setItem('userLoggedIn', true);
  //     }

  //     localStorage.setItem('loggedIn', true);

  //     // Show a success message with SweetAlert
  //     Swal.fire({
  //       icon: 'success',
  //       title: '🎉 Login Successful 🎉',
  //       text: `You are logged in at ${window.navigator.userAgent}.`,
  //       showConfirmButton: false,
  //       timer: 5000,
  //     });

  //     // Redirect to the dashboard or profile page after a delay
  //     setTimeout(() => {
  //       goto('/profile');
  //     }, 5000);
  //   } catch (error) {
  //     // Login failed, show an error message
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Login Failed',
  //       text: error.message,
  //     });
  //   }
  // };


  const handleLogin = async () => {
  try {
    // Send OTP via email
    const response = await fetch('https://node-api-7kbn.onrender.com/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Error sending OTP');
    }

    // Extract the OTP value from the response
    const { otp, error } = await response.json();

    // OTP sent successfully, prompt the user to enter the OTP
    const { value: enteredOTP, isConfirmed } = await Swal.fire({
      title: 'Enter OTP',
      input: 'text',
      inputPlaceholder: 'Enter OTP',
      showCancelButton: true,
      confirmButtonText: 'Verify',
    });

    // Ensure enteredOTP is a string and trim any whitespace
    const trimmedEnteredOTP = String(enteredOTP).trim();

    if (isConfirmed && trimmedEnteredOTP === otp) {
      // OTP is correct, allow profile access
      Swal.fire({
        icon: 'success',
        title: 'OTP Verified',
        text: 'You are now logged in.',
        showConfirmButton: false,
        timer: 3000,
      });

      // Store the user's session in the database
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userSessionRef = ref(db, `users/${userCredential.user.uid}/userSessions`);
      await set(userSessionRef, {
        fingerprint,
        userAgent: window.navigator.userAgent,
        platform: window.navigator.platform,
      });

      // Check if "Keep me logged in" is selected
      if (rememberMe) {
        localStorage.setItem('userLoggedIn', true);
      }

      localStorage.setItem('loggedIn', true);

      // Redirect to the dashboard or profile page after a delay
      setTimeout(() => {
        goto('/profile');
      }, 3000);
    } else {
      // Incorrect OTP or user canceled, show an error message
      Swal.fire({
        icon: 'error',
        title: 'OTP Verification Failed',
        text: 'Please enter the correct OTP.',
      });
    }
  } catch (error) {
    // Error sending OTP or login failed, show an error message
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error.message,
    });
  }
};






  const showForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Forgot Password',
      html: '<input id="swal-input1" class="swal2-input" placeholder="Enter your email">',
      focusConfirm: false,
      preConfirm: () => {
        return document.getElementById('swal-input1').value;
      },
    });

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);

        // Password reset email sent successfully
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Email Sent',
          text: 'Please check your email for instructions on resetting your password.',
        });
      } catch (error) {
        // Password reset email failed
        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: error.message,
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };
</script>


<!-- Your login form HTML here -->


<div class="main-page-wrapper">
  <div>
    <Banner title="Donor Candidates Login"  />
    <!-- Other content for the "About" page -->
  </div>

  <section class="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
    <div class="container">
      <div class="user-data-form">
        <div class="text-center">
          <h2>Login to your Account</h2>
        </div>
        <div class="form-wrapper m-auto">
        
          <div class="tab-content mt-40">
            <div class="tab-pane fade show active" role="tabpanel" id="fc1">
              <form>
                <div class="row">
               


                  <div class="col-12">
                    <div class="input-group-meta position-relative mb-25">
                      <label for="phoneNumber">Email*</label>
                      <input type="email" placeholder="Enter your Email" bind:value={email} autocomplete="off"/>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="input-group-meta position-relative mb-20">
                      <label for="password">Password* </label>
                      {#if showPassword}
                        <input
                          type="text"
                          placeholder="Enter Password"
                          bind:value={password}
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
                        <button type="button" class="toggle-password" on:click={togglePasswordVisibility}>
                            {showPassword ? 'Hide Password' : 'Show Password'}
                          </button>
                      </div>
                      
                    </div>
                  </div>
                  
                
                  <div class="agreement-checkbox d-flex justify-content-between align-items-center">
                    <div>
                      <input type="checkbox" bind:checked={rememberMe} id="remember">
<label for="remember">Keep me logged in</label>

                    </div>
                    <a href on:click|preventDefault={showForgotPassword}>Forget Password?</a>
                  </div>
                  <div class="col-12">
<button type="button" class="btn-eleven fw-500 tran3s d-block mt-20" on:click={handleLogin}>Login</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
  
          <div class="d-flex align-items-center mt-30 mb-10">
            <div class="line"></div>
            <span class="pe-3 ps-3">OR</span>
            <div class="line"></div>
          </div>
        
          <p class="text-center mt-10">Have an account? <a href="/" class="fw-500" data-bs-toggle="modal" data-bs-target="#loginModal">Sign In</a></p>
        </div>
        <!-- /.form-wrapper -->
      </div>
      <!-- /.user-data-form -->
    </div>
  </section>
</div>