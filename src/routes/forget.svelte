<script>

import Banner from "../components/InnerBanner.svelte";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Swal from 'sweetalert2';
import { getDatabase, ref, get, set as setDatabase  } from "firebase/database";
import { firebaseApp } from '../firebase';


const db = getDatabase(firebaseApp);
let email = '';





async function handleForgetPassword() {
  try {
    const result = await Swal.fire({
      title: 'Forget Password?',
      input: 'email',
      inputPlaceholder: 'Enter your email address',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      cancelButtonText: 'Cancel',
      preConfirm: async (value) => {
        if (!value) {
          Swal.showValidationMessage('Please enter your email address.');
          return false;
        }

        const auth = getAuth();
        await sendPasswordResetEmail(auth, value);
        return value;
      },
    });

    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Password Reset Email Sent',
        text: 'A password reset email has been sent to your email address. Please check your inbox.',
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Password Reset Failed',
      text: error.message,
    });
  }
}
</script>
  <div class="main-page-wrapper">
    <div>
      <Banner title="Forget Donor Account"  />
      <!-- Other content for the "About" page -->
    </div>
  
    <section class="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
        <div class="container">
          <div class="user-data-form">
            <div class="text-center">
                <p>Recover your kurudhi.com donor account effortlessly with our streamlined Forget Account feature.</p>
            
            </div>
            <div class="form-wrapper m-auto">
            
              <div class="tab-content mt-40">
                <div class="tab-pane fade show active" role="tabpanel" id="fc1">
                  <form>
                    <div class="row">
                   
    
    
                        <div class="col-12">
                            <div class="input-group-meta position-relative mb-25">
                              <button type="button" class="btn-eleven fw-500 tran3s d-block mt-20" href on:click|preventDefault={handleForgetPassword} >Forget Password?</button>
                            </div>
                          </div>
                
                    </div>
                  </form>
                </div>
              </div>
      
    
            </div>
            <!-- /.form-wrapper -->
          </div>
          <!-- /.user-data-form -->
        </div>
      </section>
  </div>