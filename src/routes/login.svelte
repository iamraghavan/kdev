<script>
    import { onMount } from 'svelte';
    import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
    // import { navigate } from 'svelte-routing';
    import Swal from 'sweetalert2';
    import { goto } from '@sapper/app';
    import Banner from "../Components/InnerBanner.svelte";
    import { getDatabase, ref, set, get  } from 'firebase/database';
    import { page } from '@sapper/app'

    import { firebaseApp } from '../firebase';

const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);


  
    let email = '';
    let password = '';
  
    onMount(() => {
      const inputFields = document.querySelectorAll('input[autocomplete="off"]');
      inputFields.forEach((input) => {
        input.setAttribute('autocomplete', 'new-password');
      });
    });


  
    async function handleLogin() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firebase Realtime Database
    const userRef = ref(db, 'users/' + user.uid); // Adjust the database path to your structure
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (userData) {
      // Successfully logged in
      const timestamp = new Date();
      const formattedTimestamp = timestamp.toISOString();

      Swal.fire({
        icon: 'success',
        title: '🎉 Login Successful 🎉',
        text: `You are logged in at ${formattedTimestamp} from ${window.navigator.userAgent}.`,
        showConfirmButton: false,
        timer: 5000,
      });

      const { name, email, dateOfBirth } = userData;

// Use the data in your component as needed, for example, update the store
page.store.update((store) => {
  store.userData = {
    name,
    email,
    dateOfBirth,
  };
});

// Redirect to the dashboard page
goto('/dashboard'); // Replace with the correct route

      // Use the data in your component as needed
    } else {
      // User data not found
      Swal.fire({
        icon: 'error',
        title: 'User Data Not Found',
        text: 'User data could not be retrieved from the database.',
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error.message,
    });
  }
}


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
                    
                  
                    <div class="col-12">
                      <div class="agreement-checkbox d-flex justify-content-between align-items-center">
                        <div>
                          <input type="checkbox" id="remember">
                          <label for="remember">By hitting the "Register" button, you agree to the <a href="/">Terms conditions</a> & <a href="/">Privacy Policy</a></label>
                        </div>
                      </div>
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