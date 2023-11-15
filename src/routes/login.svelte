<script>
  import { onMount } from 'svelte';
  import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
  import { ref, get, set } from 'firebase/database';
  import Swal from 'sweetalert2';
  import { goto } from '@sapper/app';

  import Banner from "../components/InnerBanner.svelte";
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

  import { firebaseApp } from '../firebase';

  const auth = getAuth(firebaseApp);
  const db = ref(firebaseApp.database());

  let rememberMe = false;
  let email = '';
  let password = '';
  let visitorId;

  onMount(() => {
    // Generate a custom visitor ID based on user agent and screen resolution
    visitorId = getVisitorId();

    // Check if the user is already logged in from another browser
    checkExistingSession();
  });

  const getVisitorId = () => {
    // You can create a custom visitor ID by combining various factors,
    // such as user agent, screen resolution, and more.
    const userAgent = window.navigator.userAgent;
    const screenResolution = window.screen.width + 'x' + window.screen.height;
    const combinedInfo = userAgent + screenResolution;

    // You can hash the combined information to generate a visitor ID.
    // Here, we use a simple example with the 'btoa' function, which encodes
    // the information as base64.
    const visitorId = btoa(combinedInfo);

    return visitorId;
  };

  const checkExistingSession = async () => {
    try {
      // Check if the user is already logged in from another browser
      const userSessionRef = ref(db, `userSessions/${auth.currentUser?.uid}`);
      const existingSession = await get(userSessionRef);

      if (existingSession && existingSession.val().visitorId !== visitorId) {
        // User is already logged in from another browser
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: 'You are already logged in from another browser.',
        });

        // Redirect to a login page or perform any other action
        goto('/login');

        // Optionally, sign out the current user
        // await signOut(auth);

        return;
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
    }
  };

  const handleLogin = async () => {
    try {
      // Check if the user is already logged in from another browser
      await checkExistingSession();

      // Log in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Store the user's session in the database
      const userSessionRef = ref(db, `userSessions/${userCredential.user.uid}`);
      await set(userSessionRef, { visitorId });

      // Check if "Keep me logged in" is selected
      if (rememberMe) {
        localStorage.setItem('userLoggedIn', true);
      }

      localStorage.setItem('loggedIn', true);

      // Show a success message with SweetAlert
      Swal.fire({
        icon: 'success',
        title: '🎉 Login Successful 🎉',
        text: `You are logged in at ${window.navigator.userAgent}.`,
        showConfirmButton: false,
        timer: 5000,
      });

      // Redirect to the dashboard or profile page after a delay
      setTimeout(() => {
        goto('/profile');
      }, 5000);
    } catch (error) {
      // Login failed, show an error message
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    }
  };

  let showPassword = false;

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<style>
  /* Add your styles here */
</style>

  
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