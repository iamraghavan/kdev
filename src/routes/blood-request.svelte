<svelte:head>
  <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Need blood urgently? Get quick and easy help at Kurudhi.com</title>
<meta name="description" content="Need blood urgently? Get quick and easy help at Kurudhi.com with just one click. You can easily request blood on their website.">
<meta name="author" content="J S Raghavan">
<meta name="copyright" content="Bumble Bees IT Solutions">
<meta name="robots" content="index, follow">
</svelte:head>

<script>
    import Banner from '../components/InnerBanner.svelte';
    import { onMount } from 'svelte';
    import _ from 'lodash';
    import axios from 'axios';
    import Swal from 'sweetalert2';
    import Toastify from "toastify-js";
    import { goto } from '@sapper/app';
    import toastr from "toastr";

    let city = '';
    let suggestions = [];
    let selectedSuggestion = null;
    let error = null;
    let checkboxChecked = false;
    let lastFetchId = 0;
  
    let AttenderName = "";
    let patentName = "";
    let AttePhoneNumber = "";
    let bloodGroup = "";
    let Unit = "";
    let bloodRequiredDate = "";
  
    const debouncedFetchLocationSuggestions = _.debounce(fetchLocationSuggestions, 300);
  
    const nominatimApiUrl = 'https://nominatim.openstreetmap.org/search';
    const indiaBoundingBox = '-68.18,6.75,97.4,35.9';
  
    async function fetchLocationSuggestions() {
      try {
        error = null; // Reset error on each fetch
  
        if (!city) {
          suggestions = [];
          return;
        }
  
        const fetchId = ++lastFetchId;
  
        const response = await axios.get(nominatimApiUrl, {
          params: {
            q: city,
            format: 'json',
            limit: 5,
            bounded: 1,
            viewbox: indiaBoundingBox,
            countrycodes: 'IN',
          },
        });
  
        if (fetchId === lastFetchId) {
          if (response.data && response.data.length > 0) {
            suggestions = response.data.map((result, index) => ({
              name: result.display_name.split(',').shift(),
              key: `${result.display_name}-${index}`,
            }));
          } else {
            suggestions = [{ name: city, key: `custom-${city}` }];
          }
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        suggestions = [];
        error = 'Error fetching suggestions. Please try again.';
      }
    }
  
    function handleSuggestionClick(selectedCity) {
      city = selectedCity;
      selectedSuggestion = selectedCity;
      suggestions = [];
    }
  
    function handleKeyDown(event, suggestion) {
      if (event.key === 'Enter') {
        handleSuggestionClick(suggestion);
      }
    }
  
    $: debouncedFetchLocationSuggestions();
  
    const sendRequest = async () => {

        if (!checkboxChecked) {
    
          toastr.options = {
      closeButton: true,
      debug: true,
      newestOnTop: true,
      progressBar: true,
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
    };

    toastr.info('Please confirm that the provided information is accurate and correct.', 'Notification');
    return;
  }
    
    if (!AttenderName || !patentName || !AttePhoneNumber || !bloodGroup || !Unit || !bloodRequiredDate || !city) {
     

      toastr.options = {
      closeButton: true,
      debug: true,
      newestOnTop: true,
      progressBar: true,
      positionClass: 'toast-bottom-full-width',
      preventDuplicates: true,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
    };

    toastr.info('All input fields are required.', 'Notification');

       
    return;

    }

    try {
      // Show loading animation
      Swal.fire({
        title: 'Request Sending ...!',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Make API request
      const response = await fetch('https://send-bulk-mail-kurudhi.onrender.com/send-bulk-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          AttenderName,
          patentName,
          AttePhoneNumber,
          bloodGroup,
          Unit,
          bloodRequiredDate,
          city,
        }),
      });

      // Close loading animation
      Swal.close();

      // Get and display the result
      const result = await response.text();
      Swal.fire({
  icon: 'success',
  title: 'Your Request has been sent Successfully!',
  text: result,
  showConfirmButton: true,
  confirmButtonText: 'Go to Donor Search',
  allowOutsideClick: false,
}).then((result) => {
  if (result.isConfirmed) {
    // Use goto to navigate
    goto('donor/search-blood-donors-by-pincode');
  }
});

      console.log(result);
    } catch (error) {
      console.error('Error sending email:', error);

      // Display error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while sending the email. Please try again.',
      });
    }
  };
  </script>
  

  
  


<div class="main-page-wrapper">
    <div>
      <Banner title="Post your Blood Request"  />
      <!-- Other content for the "About" page -->
    </div>

<section class="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
    <div class="container">
        <div class="user-data-form">
            <!-- <div class="text-center">
                <h2>Create Account</h2>
            </div> -->
            <div class="form-wrapper m-auto">
              
                <div class="tab-content mt-40">
                    <div class="tab-pane fade show active" role="tabpanel" id="fc1">
                        <form action="#">
                            <div class="row">
                                <div class="col-12">
                                    <div class="input-group-meta position-relative mb-25">
                                        <label for>Patient Name*</label>
                                        <input bind:value={patentName} type="text" placeholder="Patient Name">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="input-group-meta position-relative mb-25">
                                        <label for>Attendee Name*</label>
                                        <input type="text" bind:value={AttenderName} placeholder="Attendee Name">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="input-group-meta position-relative mb-25">
                                        <label for>Attendee Mobile *</label>
                                        <input
                          type="tel"
                          maxlength="10"
                          minlength="10"
                          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                          placeholder="Enter your Phone Number"
                          bind:value={AttePhoneNumber}
                          autocomplete="off"
                          
                        />
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="input-group-meta position-relative mb-25">
                                        <label for >Blood Group *</label>
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
                                    <div class="input-group-meta position-relative mb-20">
                                        <label for="">Quantity / Unit *</label>
                                        <input bind:value={Unit} type="number" placeholder="Enter Quantity / Unity">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="input-group-meta position-relative mb-20">
                                        <label for="">Required Date *</label>
                                        <input
                        type="date"
                        id="txtDate"
                        autocomplete="off"
                        bind:value={bloodRequiredDate}
                      />
                                    </div>
                                </div>

                               

                                <div class="col-12">
                                    <div class="input-group-meta position-relative mb-20">
                                      <label for="location">Address / Location *</label>
                                      <input
                                        type="text"
                                        placeholder="Enter Address / Location"
                                        id="location" 
                                        bind:value={city}
                                        on:input={debouncedFetchLocationSuggestions}
                                      />
                                      {#if suggestions.length > 0 && !selectedSuggestion}
                                        <div class="collapse-container">
                                          <div class="suggestions">
                                            {#each suggestions as { name, key }}
                                              <div
                                                class="suggestion-item"
                                                on:click={() => handleSuggestionClick(name)}
                                                on:keydown={(event) => handleKeyDown(event, name)}
                                                tabindex="0"
                                                role="button"
                                                aria-label={`Select ${name}`}
                                                {key}
                                              >
                                                {name}
                                              </div>
                                            {/each}
                                          </div>
                                        </div>
                                      {/if}
                                    </div>
                                  </div>


                                <div class="col-12">
                                    <div class="agreement-checkbox d-flex justify-content-between align-items-center">
                                        <div>
                                            <input type="checkbox" id="remember" bind:checked={checkboxChecked}>
                                            <label for="remember">I confirm that the provided information is accurate and correct</label>
                                        </div>
                                    </div> <!-- /.agreement-checkbox -->
                                </div>
                                <div class="col-12">
                                    <button  on:click|preventDefault={sendRequest} class="btn-eleven fw-500 tran3s d-block mt-20">Send Request <i class="bi bi-send"></i></button>
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


<style>
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

.collapse-container {
    position: relative;
    width: 100%;
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px; /* Adjust the max-height based on your design */
    overflow-y: auto;
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .suggestion-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;

    /* Add hover effect */
    transition: background-color 0.3s;
  }

  .suggestion-item:hover {
    background-color: #f0f0f0;
  }
</style>