<svelte:head>
  <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Login for Donor Candidates - Empowering Lives at Kurudhi.com</title>
<meta name="description" content="Join Kurudhi.com as a donor candidate and save lives. Log in as a donor candidate at Kurudhi.com and unlock the power to save lives.">
<meta name="author" content="J S Raghavan">
<meta name="copyright" content="Bumble Bees IT Solutions">
<meta name="robots" content="index, follow">
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
  import Swal from 'sweetalert2';
  import { goto } from '@sapper/app';
  import { writable } from 'svelte/store';
  import UAParser from 'ua-parser-js';
  import Banner from '../components/InnerBanner.svelte';
  import { firebaseApp } from '../firebase';

  const auth = getAuth(firebaseApp);

  let email = '';
  let password = '';
  let rememberMe = writable(false);
  let showPassword = false;
  let isLoading = false;

  onMount(() => {
    const inputFields = document.querySelectorAll('input[autocomplete="off"]');
    inputFields.forEach((input) => {
      input.setAttribute('autocomplete', 'new-password');
    });

    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn) {
      goto('/profile');
      console.log('User already logged in.');
    }
  });

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please enter both email and password.',
        });
        return;
      }

      isLoading = true;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if ($rememberMe) {
        localStorage.setItem('userLoggedIn', true);
      }

      localStorage.setItem('loggedIn', true);

      const timestamp = new Date().toLocaleString();
      const device = window.navigator.userAgent;

      Swal.fire({
        icon: 'success',
        title: '🎉 Login Successful 🎉',
        text: `You are logged in at ${device}.`,
        showConfirmButton: false,
        timer: 2000,
      }).then(async () => {
        const location = "Your logic to get location"; // Implement your logic to get location
        const parser = new UAParser();
        const browser = parser.getBrowser().name + ' ' + parser.getBrowser().version;

        await fetch('https://send-bulk-mail-kurudhi.onrender.com/sendMail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: userCredential.user.email,
            subject: 'Login Successful',
            message: `
            <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
    }

    header {
      background-color: #222222;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }

    header img {
      max-width: 100%;
      height: auto;
    }

    footer {
      background-color: #f6f6f6;
      padding: 20px;
      text-align: center;
    }

    footer p {
      margin: 0;
    }

    .content {
      padding: 20px;
    }

    .content p {
      margin-bottom: 15px;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    ul li {
      margin-bottom: 10px;
    }
  </style>
</head>

<body>
  <div class="container">
    <header>
      <img src="https://mcolfw.stripocdn.email/content/guids/CABINET_39254364a214f8068da04f2ed695900b7184bdb10d1b1fcfa5d66b206aab1e38/images/untitled2.png" alt="Logo">
    </header>

    <div class="content">
      <p>Hello,</p>
      <p>You have successfully logged in. Here are the details:</p>
      <ul>
        <li><strong>Timestamp:</strong> ${timestamp}</li>
        <li><strong>Login Device:</strong> ${device}</li>
        
        <li><strong>Browser:</strong> ${browser}</li>
      </ul>
      <p>If you did not perform this login, please contact us immediately.</p>
      <p>Thank you for using our service!</p>
    </div>

    <footer>
      <p>This message was sent from Bumble Bees IT Solutions, Chennai</p>
    </footer>
  </div>
</body>

</html>
            `,
          }),
        });

        goto('/profile');
      });

    } catch (error) {
      isLoading = false;
      let errorMessage = 'Login Failed';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please check your email and password.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else {
        console.error(error);
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
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

        Swal.fire({
          icon: 'success',
          title: 'Password Reset Email Sent',
          text: 'Please check your email for instructions on resetting your password.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: error.message,
        });
      }
    }
  };

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
