<svelte:head>
  <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Easily Find Blood Donors Near You on Kurudhi.com</title>
<meta name="description" content="Search for blood donors in your location effortlessly with Kurudhi.com">
<meta name="author" content="J S Raghavan">
<meta name="copyright" content="Bumble Bees IT Solutions">
<meta name="robots" content="index, follow">
</svelte:head>

<script>
  import { getDatabase, ref, get } from "firebase/database";
  import { onMount, afterUpdate } from "svelte";
  import axios from "axios";
  import { firebaseApp } from "../../firebase";
  import _ from "lodash";
  import { readable } from "svelte/store";
  import { goto } from "@sapper/app";

  import toastr from "toastr";

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-bottom-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
  };


  // Import Banner if it's a component
  import Banner from "../../components/InnerBanner.svelte";

  const db = getDatabase(firebaseApp);

  let noimage = { img: "./images/no-data-pana.svg" };

  let isLoading = false;
  let error = "";
  let noofresults = 0;
  let currentPage = 1;
  let itemsPerPage = 20;
  let pages = [];
  let filteredDataArray = [];



  // Function to show success notification
  const showSuccessNotification = (message) => {
    toastr.success(message);
  };

  // Function to show error notification
  const showErrorNotification = (message) => {
    toastr.error(message);
  };



  // Define the filteredData store
  function viewUserProfile(uid) {
    event.preventDefault();
    goto(`donor/${uid}`, { state: { value: uid } });
  }
  
  const applyFilter = async (event) => {
    if (!selectedSuggestion || !bloodGroup) {
      toastr.error("Please fill in all required fields.");
      return;
    }

    try {
      const snapshot = await get(ref(db, "users"));

      filteredDataArray = [];

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();

        if (
          ((data.city && data.city.includes(selectedSuggestion)) ||
            (data.area && data.area.includes(selectedSuggestion))) &&
          data.bloodGroup === bloodGroup
        ) {
          filteredDataArray.push({
            uid: data.uid,
            fullName: data.fullName,
            age: data.age,
            gender: data.gender,
            email: data.email,
            phoneNumber: data.phoneNumber,
            whatsapp: data.whatsapp,
          });
        }
      });

      // Shuffle the filteredDataArray
      shuffleArray(filteredDataArray);

      noofresults = filteredDataArray.length;

      // Update the store
    } catch (err) {
      error = err.message || "Error fetching data from Firebase";
    }
  };

  // Function to shuffle array elements
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };


  const filteredData = readable([], (set) => {
    // Initial call to applyFilter
    applyFilter();

    // Return cleanup function
    return () => {};
  });



  $: noofresults = filteredData.length;
  $: pages = Array.from(
    { length: Math.ceil(noofresults / itemsPerPage) },
    (_, index) => index + 1
  );

  // Update filteredDataArray whenever the Backbone Collection changes
  $: {
    filteredDataArray = filteredData && filteredData.models ? filteredData.models.map((model) => model.toJSON()) : [];
  }



  let inputValue = "";
  let suggestions = [];
  let selectedSuggestion = null;
  let bloodGroup = ""; // Assuming bloodGroup should be declared
 // Declaring applyFilter function

  const debouncedFetchLocationSuggestions = _.debounce(
    fetchLocationSuggestions,
    300
  );

  const nominatimApiUrl = "https://nominatim.openstreetmap.org/search";

  async function fetchLocationSuggestions() {
    try {
      if (!inputValue) {
        suggestions = [];
        return;
      }

      const response = await axios.get(nominatimApiUrl, {
        params: {
          q: inputValue,
          format: "json",
          limit: 5,
        },
      });

      if (response.data && response.data.length > 0) {
        suggestions = response.data.map((result, index) => ({
          name: result.display_name.split(",").shift(),
          key: `${result.display_name}-${index}`,
        }));
      } else {
        suggestions = [{ name: inputValue, key: `custom-${inputValue}` }];
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }

  function handleSuggestionClick(city) {
    inputValue = city;
    selectedSuggestion = city;
    suggestions = [];
  }

  function handleKeyDown(event, suggestion) {
    if (event.key === "Enter") {
      handleSuggestionClick(suggestion);
    }
  }

  function goToNextPage() {
    if (currentPage < pages.length) {
      currentPage += 1;
      applyFilter();
    }
  }

  function goToPage(page) {
    currentPage = page;
    applyFilter();
  }

  afterUpdate(() => {
    debouncedFetchLocationSuggestions();
  });

  let visiblePages;

  $: visiblePages = pages.slice(currentPage - 1, currentPage + 4);
</script>




<style>

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid #333;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 0.8s linear infinite;
  }

  /* Add styling for error messages */
  .error-message {
    color: red;
    font-size: 16px;
  }

  /* Add styling for pagination */
  .pagination-two li {
    margin: 0 5px;
  }


  .collapse-container {
    position: relative;
  }

  .suggestions {

    top: 100%;
    width: 100%;

   margin-top: 1rem;
    border: 1px solid rgba(0, 0, 0, .06);


  }

  .suggestion-item {
    width: 100%;

    font-size: 16px;
 

    padding: 0 52px 0 20px;
    color: #000;

    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .suggestion-item:hover {
    background: rgba(49, 121, 90, .15);
  }
</style>

<div class="main-page-wrapper">
  <div>
    <Banner title="Search blood donors near you using a Locaton" />
  </div>


 {#if isLoading}
    <div class="spinner"></div>
  {/if}

  <!-- Display error message -->
  {#if error}
    <p class="error-message">{error}</p>
  {/if}

  <section class="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
    <div class="container">
              <div class="row">
                  <div class="col-12">
                      <div class="filter-area-tab">
                          <div class="light-bg border-20 ps-4 pe-4">
                              <a class="filter-header border-20 d-block collapsed" data-bs-toggle="collapse" href="#collapseFilterHeader" role="button" aria-expanded="false"><span class="main-title fw-500 text-dark">Search Donors By</span></a>
                             
                              <div class="border-top collapse" id="collapseFilterHeader" style="">
                                  <div class="pt-25 pb-30">
                                      <div class="row">
                                          
                                        <div class="col-lg-6 col-sm-6">
                                          <div class="filter-block pb-50 lg-pb-20">
                                              <div class="filter-title fw-500 text-dark">Searching Location <i class="bi bi-radar"></i></div>
                                              <input
                                                  style="
                                                      width: 100%;
                                                      height: 55px;
                                                      font-size: 16px;
                                                      border: 1px solid rgba(0, 0, 0, .06);
                                                      border-radius: 8px;
                                                      padding: 0 52px 0 20px;
                                                      color: #000;
                                                      background: rgba(49, 121, 90, .09);
                                                  "
                                                  type="text"
                                                  bind:value={inputValue}
                                                  placeholder="Enter location..."
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
                                          <!-- /.filter-block -->
                                      </div>
                                      
                                        
                                          <div class="col-lg-6 col-sm-6">
                                              <div class="filter-block pb-50 lg-pb-20">
                                                  <div class="filter-title fw-500 text-dark">Blood Group <i class="bi bi-droplet"></i></div>
                                                  <select
                        style="
                                          width: 100%;
      height: 55px;
      font-size: 16px;
      border: 1px solid rgba(0, 0, 0, .06);
      border-radius: 8px;
      padding: 0 52px 0 20px;
      color: #000;
      background: rgba(49, 121, 90, .09);
                                          "
                        bind:value={bloodGroup}
                        class="form-select"
                        id="id3"
                        name="bloodGroupType"
                        required
                      >
                        <option disabled hidden style="display:none" value=""
                          >Choose... Blood</option
                        >
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
                                              <!-- /.filter-block -->
                                          </div>

                                          <div class="col-lg-4 col-sm-6">
                                            <div class="filter-block pb-50 lg-pb-20">
                                                
                                               
                                                <h6><i class="bi bi-location"></i>Your chosen city is: {inputValue}</h6>
                                            
                                              </div>
                                            
                                        </div>
                                      </div>
  
      
                                      <div class="row">
                                          <div class="col-xl-2 m-auto">
                                              <a href
                                              on:click={(event) => {
                                                event.preventDefault();
                                                applyFilter();
                                              }} class="btn-ten fw-500 text-white w-100 text-center tran3s mt-30 md-mt-10">Apply Filter</a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <!-- /.filter header -->
                          </div>
                      </div>
                      <!-- /.filter-area-tab -->
                  </div>
  
  
       
        <!-- /.col- -->
              </div>
          </div>
  </section>


  <section class="candidates-profile bg-color pt-90 lg-pt-70 pb-160 xl-pb-150 lg-pb-80">
    <div class="container">
      <div class="row">
      




        <div class="col-xl-12 col-lg-8">
          <div style="
          padding: 1.4rem 0rem;" class="total-job-found">
            All <span class="text-dark">{noofresults || "0"}</span> Results found
          </div>
      
          <div class="ms-xxl-5 ms-xl-3">
            <div class="accordion-box grid-style show">
            <div class="row">
            
              {#each filteredDataArray as { uid, fullName, age, gender, email, phoneNumber, whatsapp }}
              <div class="col-xxl-3 col-lg-4 col-sm-6 d-flex">
                <div class="candidate-profile-card text-center grid-layout border-0 mb-25">
                    <a href on:click={() => viewUserProfile(uid)} class="save-btn tran3s"><i class="bi bi-heart"></i></a>
                    
                    <h4 class="candidate-name mt-15 mb-0"><a href on:click={() => viewUserProfile(uid)} class="tran3s">{fullName}</a></h4>
                   <div class="candidate-post">{age} | {gender}</div>
                   <ul style="align-self: center;" class="cadidate-skills style-none d-flex flex-wrap align-items-center justify-content-center justify-content-md-between pt-30 sm-pt-20 pb-10">
                        <li>{email}</li>
                        
                   </ul>
                   <!-- /.cadidate-skills -->
                   <div class="row gx-1">
                        <div class="col-md-6">
                            <div class="candidate-info mt-10">
                              <span>Phone</span>
                              <div>{phoneNumber}</div>
                            </div>
                            <!-- /.candidate-info -->
                        </div>
                        <div class="col-md-6">
                            <div class="candidate-info mt-10">
                              <span>Whatsapp</span>
                              <div>{whatsapp}</div>
                            </div>
                            <!-- /.candidate-info -->
                        </div>
                   </div>
                   <div class="row gx-2 pt-25 sm-pt-10">
                        <div class="col-md-12">
                            <a href on:click={(event) => { event.preventDefault(); viewUserProfile(uid); }} class="profile-btn tran3s w-100 mt-5">View Profile</a>
                        </div>
                        
                       </div>
                </div> 
                <!-- /.candidate-profile-card -->
            </div>
      {/each}
      
      
      
              {#if filteredData.length === 0}
              <img
                src={noimage.img}
                alt="No data found"
                class="center-image"
              />
              <p>No matching data found.</p>
              {/if}
      
              {#if error}
              <p>{error}</p>
              {/if}
            </div>
            </div>
            <!-- /.accordion-box -->
      
            <div
            class="pt-20 d-sm-flex align-items-center justify-content-between"
            >
            <p class="m0 order-sm-last text-center text-sm-start xs-pb-20">
              Showing <span class="text-dark fw-500"
              >1 to {Math.min(20, filteredData.length) || "0"}</span
              >
              of <span class="text-dark fw-500">{filteredData.length || "0"}</span>
            </p>
            <div class="d-flex justify-content-center">
              

              <!-- Improved pagination UI -->
              <ul class="pagination-two d-flex align-items-center style-none">
                {#if currentPage > 1}
                  <li><a href onclick={() => goToPage(currentPage - 1)}>&lt;</a></li>
                {/if}
                {#each visiblePages as page}
                  <li class:selected={page === currentPage}>
                    <a href onclick={() => goToPage(page)}>{page}</a>
                  </li>
                {/each}
                {#if currentPage < pages.length}
                  <li><a href onclick={() => goToPage(currentPage + 1)}>&gt;</a></li>
                {/if}
              </ul>
            </div>
            </div>
          </div>
          
          
          </div>
        <!-- /.col- -->
      </div>
    </div>
  </section>
  


</div>
