<script>
  import { getDatabase, ref, get } from "firebase/database";
  import { onMount, afterUpdate } from "svelte";
  import axios from "axios";
  import { firebaseApp } from "../../firebase";
  import _ from "lodash";
  import { readable } from "svelte/store";
  import { goto } from "@sapper/app";

  // Import Banner if it's a component
  import Banner from "../../components/InnerBanner.svelte";

  const db = getDatabase(firebaseApp);

  let noimage = { img: "./images/no-data-pana.svg" };

  let error = "";
  let noofresults = 0;
  let currentPage = 1;
  let itemsPerPage = 20;
  let pages = [];
  let filteredDataArray = [];


  // Define the filteredData store
  function viewUserProfile(uid) {
    goto(`donor/${uid}`, { state: { value: uid } });
  }
  
  const applyFilter = async (event) => {
    
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

      noofresults = filteredDataArray.length;

      // Update the store
      
    } catch (err) {
      error = err.message || "Error fetching data from Firebase";
    }
  };

  const filteredData = readable([], (set) => {
    // Initial call to applyFilter
    applyFilter();

    // Return cleanup function
    return () => {};
  });



  // const filteredData = readable([], (set) => {
  //   const applyFilter = async (event) => {
  //     event.preventDefault();
  //     try {
  //       const snapshot = await get(ref(db, "users"));

  //       filteredDataArray = [];

  //       snapshot.forEach((childSnapshot) => {
  //         const data = childSnapshot.val();

  //         if (
  //           ((data.city && data.city.includes(selectedSuggestion)) ||
  //             (data.area && data.area.includes(selectedSuggestion))) &&
  //           data.bloodGroup === bloodGroup
  //         ) {
  //           filteredDataArray.push({
  //             uid: data.uid,
  //             fullName: data.fullName,
  //             age: data.age,
  //             gender: data.gender,
  //             email: data.email,
  //             phoneNumber: data.phoneNumber,
  //             whatsapp: data.whatsapp,
  //           });
  //         }
  //       });

  //       noofresults = filteredDataArray.length;

  //       // Update the store
  //       set(filteredDataArray);
  //     } catch (err) {
  //       error = err.message || "Error fetching data from Firebase";
  //     }
  //   };

  //   // Initial call to applyFilter
  //   applyFilter();

  //   // Return cleanup function
  //   return () => {};
  // });


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
</script>




<style>
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

  <section class="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
    <div class="container">
      <div class="row">
        <div class="col-xl-3 col-lg-4">
          <button
            type="button"
            class="filter-btn w-100 pt-2 pb-2 h-auto fw-500 tran3s d-lg-none mb-40"
            data-bs-toggle="offcanvas"
            data-bs-target="#filteroffcanvas"
          >
            <i class="bi bi-funnel" />
            Filter
          </button>
          <div
            class="filter-area-tab offcanvas offcanvas-start"
            id="filteroffcanvas"
          >
            <button
              type="button"
              class="btn-close text-reset d-lg-none"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
            <div class="main-title fw-500 text-dark">Filter By</div>
            <div class="light-bg border-20 ps-4 pe-4 pt-25 pb-30 mt-20">
              <div class="filter-block bottom-line pb-25">
                <a
                  class="filter-title fw-500 text-dark"
                  data-bs-toggle="collapse"
                  href="#collapseLocation"
                  role="button"
                  aria-expanded="false">Location <i class="bi bi-geo-alt" /></a
                >
                <div class="collapse show" id="collapseLocation">
                  <div class="main-body">
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
                  </div>

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
              <!-- /.filter-block -->
              <div class="filter-block bottom-line pb-25 mt-25">
                <a
                  class="filter-title fw-500 text-dark"
                  data-bs-toggle="collapse"
                  href="#collapseJobType"
                  role="button"
                  aria-expanded="false"
                  >
                  
                  {#if selectedSuggestion}
      <p>Location Fetched</p>
    {:else if inputValue}
      <p>Searching Location...</p>
    {/if}

                  </a
                >
                <div class="collapse show" id="collapseJobType">
                  <div class="main-body">
                    <ul class="style-none filter-input">
                      {#if selectedSuggestion || "Searching"}
                        <li>
                          <span>{selectedSuggestion || "Searching"}</span>
                        </li>
                      {/if}
                    </ul>
                    {#if error}
                      <p>{error}</p>
                    {/if}
                  </div>
                </div>
              </div>
              <!-- /.filter-block -->
              <div class="filter-block bottom-line pb-25 mt-25">
                <a
                  class="filter-title fw-500 text-dark"
                  data-bs-toggle="collapse"
                  href="#collapseExp"
                  role="button"
                  aria-expanded="false"
                  >Blood Group <i class="bi bi-droplet" /></a
                >
                <div class="collapse show" id="collapseExp">
                  <div class="main-body">
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
                </div>
              </div>

              <button

  on:click={(event) => {
    event.preventDefault();
    applyFilter();
  }}
  class="btn-ten fw-500 text-white w-100 text-center tran3s mt-30"
>
  Apply Filter
</button>
            </div>
          </div>
          <!-- /.filter-area-tab -->
        </div>

        <div class="col-xl-9 col-lg-8">
          <div class="total-job-found">
            All <span class="text-dark">{noofresults || "0"}</span> Results found
          </div>

          <div class="ms-xxl-5 ms-xl-3">
            <div class="accordion-box grid-style show">
              <div class="row">
              
                {#each filteredDataArray as { uid, fullName, age, gender, email, phoneNumber, whatsapp }}
  <div class="col-xxl-4 col-sm-6 d-flex">
    <div class="candidate-profile-card text-center grid-layout border-0 mb-25">
      <h4 class="candidate-name mt-15 mb-0">
        <a href="/" class="tran3s">{fullName}</a>
      </h4>
      <div class="candidate-post">{age} | {gender}</div>
      <ul class="cadidate-skills style-none d-flex flex-wrap align-items-center justify-content-center justify-content-md-between pt-30 sm-pt-20 pb-10">
        <li>{email}</li>
      </ul>
      <div class="row gx-1">
        <div class="col-md-6">
          <div class="candidate-info mt-10">
            <span>Phone</span>
            <div>{phoneNumber}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="candidate-info mt-10">
            <span>Whatsapp</span>
            <div>{whatsapp}</div>
          </div>
        </div>
      </div>
      <div class="row gx-2 pt-25 sm-pt-10">
        <div class="col-md-6">
          <a href="/" class="profile-btn tran3s w-100 mt-5">
            <i class="bi bi-share" />
          </a>
        </div>
        <div class="col-md-6">
          <button on:click={(event) => {
            event.preventDefault();
            viewUserProfile(uid);
          }} class="msg-btn tran3s w-100 mt-5">View</button>
        </div>
      </div>
    </div>
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
                <ul class="pagination-two d-flex align-items-center style-none">
                  <!-- You can generate these dynamically based on the number of pages -->
                  {#each pages as page}
                    <li class:selected={page === currentPage}>
                      <a href>{page}</a>
                    </li>
                  {/each}
                  <!-- Example of the next page button -->
                  <li>
                    <a href onclick="goToNextPage()"
                      ><i class="bi bi-chevron-right" /></a
                    >
                  </li>
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