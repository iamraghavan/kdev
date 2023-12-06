<script>
  import { onMount } from 'svelte';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  // import { navigate } from 'svelte-routing';
  import Swal from 'sweetalert2';
  import { goto } from '@sapper/app';
  import Banner from "../components/InnerBanner.svelte";

  import { get, ref } from 'firebase/database';
import { db } from '../firebase';

  import { firebaseApp } from '../firebase';
const auth = getAuth(firebaseApp);
// const db = getDatabase(firebaseApp);


let rememberMe;

  let email = '';
  let password = '';

  onMount(() => {
    const inputFields = document.querySelectorAll('input[autocomplete="off"]');
    inputFields.forEach((input) => {
      input.setAttribute('autocomplete', 'new-password');
    });

  });




   const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

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
      showConfirmButton: false, // Remove the OK button
      timer: 5000, // Show the message for 5 seconds (5000 milliseconds),
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

// Check for stored authentication state on component mount
onMount(() => {
  const userLoggedIn = localStorage.getItem('userLoggedIn');

  if (userLoggedIn) {
    goto('/profile');
    console.log('User already logged in.');
  }
});

  let showPassword = false;

  function togglePasswordVisibility() {
  showPassword = !showPassword;
}
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
