<!-- ForgotPassword.svelte -->

<script>
    import { onMount } from 'svelte';
    import Swal from 'sweetalert2';
    import { sendPasswordResetEmail } from 'firebase/auth';
  
    let email = '';
  
    const handleForgotPassword = async () => {
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
    };
  </script>
  
  <style>
    /* Add your styles here */
  </style>


<div class="main-page-wrapper">
    <section class="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
        <div class="container">
          <div class="user-data-form">
            <div class="text-center">
              <h2>Forgot Password</h2>
              <p>Enter your email address to receive a password reset link.</p>
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
  <button type="button" class="btn-eleven fw-500 tran3s d-block mt-20" on:click={handleForgotPassword}>Reset Password</button>
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
  
  <!-- <div>
    <h2>Forgot Password</h2>
    <p>Enter your email address to receive a password reset link.</p>
  
    <label for="email">Email:</label>
    <input type="email" id="email" bind:value={email} />
  
    <button on:click={handleForgotPassword}>Reset Password</button>
  </div> -->
  