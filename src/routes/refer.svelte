


<!-- src/routes/refer.svelte -->
<script>
    import { onMount } from "svelte";
;
    import toastr from "toastr";
  import InnerBanner from "../components/InnerBanner.svelte";
  
    let referralLink = generateReferralLink();
  
    function generateReferralLink() {
      const referralCode = Math.random().toString(36).substr(2, 8);
      return `https://kurudhi.com/register?ref=${referralCode}`;
    }
  
    function copyToClipboard() {
      const copyText = document.getElementById("referralLink");
      copyText.select();
      document.execCommand("copy");
  
      showToast();
    }
  
    function showToast() {
        toastr.success('Link copied to clipboard! Thanks for refer your friend!');
    }
  
    
    toastr.options = {
    "closeButton": true,
  "debug": true,
  "newestOnTop": true,
  "progressBar": true,  
  "positionClass": "toast-bottom-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": 0,
  "extendedTimeOut": 0,
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut",
  "tapToDismiss": false
  };


  </script>
  
  <!-- ... (rest of the component) -->
  

  <div class="main-page-wrapper">
    <div>
     <InnerBanner  title="Refer Your Friends & Family to Join our Community"/>
      <!-- Other content for the "About" page -->
    </div>

    <section class="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
        <div class="container">
          <div class="user-data-form">
            <div class="text-center">
              
              <p>Share this referral link with your friends</p>
            </div>
            <div class="form-wrapper m-auto">
              <div class="tab-content mt-40">
                <div class="tab-pane fade show active" role="tabpanel" id="fc1">
                  <form on:submit={e => e.preventDefault()}>
                    <div class="row">
                      <div class="col-12">
                        <div class="input-group-meta position-relative mb-25">
                          <input id="referralLink" bind:value={referralLink} readonly />
                        </div>
                      </div>
      
                      <div class="col-12">
                        <div class="input-group-meta position-relative mb-25">
                          <button class="btn-one" on:click={copyToClipboard}>Copy Link</button>
                        </div>
                      </div>
      
                      <div class="col-12">
                        <div class="input-group-meta position-relative mb-25">
                          <p>Or use this link: <a href={referralLink} target="_blank">{referralLink}</a></p>
                        </div>
    
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

</div>



  


  