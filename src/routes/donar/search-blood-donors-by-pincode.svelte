<script>

import Banner from "../../components/InnerBanner.svelte";


let pincode;
  let country = "India";
  let state = "";
  let division = "";
  let city = "";
  let error = "";

  async function handlePincodeInput(event) {
    const input = event.target;
    pincode = input.value; // Update the pincode

    if (pincode.length === 6) {
      await fetchAddressData(); // Fetch address data when 6 digits are entered
    } else {
      resetAddressData(); // Reset address data when pincode is invalid
    }
  }

  async function fetchAddressData() {
    try {
      const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          "Invalid pincode. Please enter a valid 6-digit pincode."
        );
      }

      const data = await response.json();

      if (data.length > 0 && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        state = postOffice.State;
        division = postOffice.Division;
        city = postOffice.Name;
        error = ""; // Reset the error if data is fetched successfully
      } else {
        throw new Error(
          "Invalid pincode. Please enter a valid 6-digit pincode."
        );
      }
    } catch (err) {
      resetAddressData(); // Reset address data if an error occurs
      error =
        err.message ||
        "An error occurred while fetching data. Please try again.";
    }
  }

  function resetAddressData() {
    state = "";
    division = "";
    city = "";
    error = "";
  }

</script>

<div class="main-page-wrapper">
    <div>
        <Banner title="Search blood donors near you using a pincode" />
        
      </div>

    <section class="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
        <div class="container">
            <div class="row">
                <div class="col-xl-3 col-lg-4">
                    <button type="button" class="filter-btn w-100 pt-2 pb-2 h-auto fw-500 tran3s d-lg-none mb-40" data-bs-toggle="offcanvas" data-bs-target="#filteroffcanvas">
                        <i class="bi bi-funnel"></i>
                        Filter
                    </button>
                    <div class="filter-area-tab offcanvas offcanvas-start" id="filteroffcanvas">
                        <button type="button" class="btn-close text-reset d-lg-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        <div class="main-title fw-500 text-dark">Filter By</div>
                        <div class="light-bg border-20 ps-4 pe-4 pt-25 pb-30 mt-20">
                            <div class="filter-block bottom-line pb-25">
                                <a class="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseLocation" role="button" aria-expanded="false">Pincode</a>
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
                          type="text "
                          on:input={handlePincodeInput}
                          inputmode="numeric"
                          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                          minlength="5"
                          maxlength="6"
                          pattern="[0-9]*"
                          placeholder="Enter your Pincode"
                          bind:value={pincode}
                          autocomplete="off"
                        />
                                    </div>
                                </div>
                            </div>
                            <!-- /.filter-block -->
                            <div class="filter-block bottom-line pb-25 mt-25">
                                <a class="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseJobType" role="button" aria-expanded="false">Job Type</a>
                                <div class="collapse show" id="collapseJobType">
                                    <div class="main-body">
                                        <ul class="style-none filter-input">
                                            {#if city}
                                            <li>
                                              <span>{city}</span>
                                            </li>
                                          {/if}
                                          {#if division}
                                            <li>
                                              <span>{division}</span>
                                            </li>
                                          {/if}
                                          {#if state}
                                            <li>
                                              <span>{state}</span>
                                            </li>
                                          {/if}
                                          {#if country}
                                            <li>
                                              <span>{country}</span>
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
                                <a class="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseExp" role="button" aria-expanded="false">Experience</a>
                                <div class="collapse show" id="collapseExp">
                                    <div class="main-body">
                                        <ul class="style-none filter-input">
                                            <li>
                                                <input type="checkbox" name="Experience" value="01">
                                                <label>Fresher <span>5</span></label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="Experience" value="02">
                                                <label>Intermediate <span>3</span></label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="Experience" value="03">
                                                <label>No-Experience <span>1</span></label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="Experience" value="04">
                                                <label>Internship <span>12</span></label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="Experience" value="05">
                                                <label>Expert <span>17</span></label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- /.filter-block -->
                            <div class="filter-block bottom-line pb-25 mt-25">
                                <a class="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseSalary" role="button" aria-expanded="false">Salary</a>
                                <div class="collapse show" id="collapseSalary">
                                    <div class="main-body">
                                        <div class="salary-slider">
                                            <div class="price-input d-flex align-items-center pt-5">
                                                <div class="field d-flex align-items-center">
                                                    <input type="number" class="input-min" value="0" readonly>
                                                </div>
                                                <div class="pe-1 ps-1">-</div>
                                                <div class="field d-flex align-items-center">
                                                    <input type="number" class="input-max" value="300" readonly>
                                                </div>
                                                <div class="currency ps-1">USD</div>
                                            </div>
                                            <div class="slider">
                                                <div class="progress"></div>
                                            </div>
                                            <div class="range-input mb-10">
                                                <input type="range" class="range-min" min="0" max="950" value="0" step="10">
                                                <input type="range" class="range-max" min="0" max="1000" value="300" step="10">
                                            </div>
                                        </div>
                                        <ul class="style-none d-flex flex-wrap justify-content-between radio-filter mb-5">
                                            <li>
                                                <input type="radio" name="jobDuration" value="01">
                                                <label>Weekly</label>
                                            </li>
                                            <li>
                                                <input type="radio" name="jobDuration" value="02">
                                                <label>Monthly</label>
                                            </li>
                                            <li>
                                                <input type="radio" name="jobDuration" value="03">
                                                <label>Hourly</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- /.filter-block -->
                            <div class="filter-block bottom-line pb-25 mt-25">
                                <a class="filter-title fw-500 text-dark collapsed" data-bs-toggle="collapse" href="#collapseCategory" role="button" aria-expanded="false">Category</a>
                                <div class="collapse" id="collapseCategory">
                                    <div class="main-body">
                                        <ul class="style-none filter-input">
                                            <li>
                                                <input type="checkbox" name="Experience" value="01">
                                                <label>Web Design <span>15</span></label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="Experience" value="02">
                                                <label>Design & Creative <span>8</span></label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="Experience" value="03">
                                                <label>It & Development <span>7</span></label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="Experience" value="04">
                                                <label>Web & Mobile Dev <span>5</span></label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="Experience" value="05">
                                                <label>Writing <span>4</span></label>
                                            </li>
                                            <li class="hide">
                                                <input type="checkbox" name="Experience" value="06">
                                                <label>Sales & Marketing <span>25</span></label>
                                            </li>
                                            <li class="hide">
                                                <input type="checkbox" name="Experience" value="07">
                                                <label>Music & Audio <span>1</span></label>
                                            </li>
                                        </ul>
                                        <div class="more-btn"><i class="bi bi-plus"></i> Show More</div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.filter-block -->
                            <div class="filter-block bottom-line pb-25 mt-25">
                                <a class="filter-title fw-500 text-dark collapsed" data-bs-toggle="collapse" href="#collapseTag" role="button" aria-expanded="false">Tags</a>
                                <div class="collapse" id="collapseTag">
                                    <div class="main-body">
                                        <ul class="style-none d-flex flex-wrap justify-space-between radio-filter mb-5">
                                            <li>
                                                <input type="checkbox" name="tags" value="01">
                                                <label>Web Design</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="tags" value="02">
                                                <label>Squarespace</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="tags" value="03">
                                                <label>Layout Design</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="tags" value="05">
                                                <label>Web Development</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="tags" value="04">
                                                <label>React</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" name="tags" value="06">
                                                <label>Full Stack</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- /.filter-block -->

                            <a href="#" class="btn-ten fw-500 text-white w-100 text-center tran3s mt-30">Apply Filter</a>
                        </div>
                    </div>
                    <!-- /.filter-area-tab -->
                </div>


                <div class="col-xl-9 col-lg-8">
                    <div class="job-post-item-wrapper ms-xxl-5 ms-xl-3">
                        <div class="upper-filter d-flex justify-content-between align-items-center mb-20">
                            <div class="total-job-found">All <span class="text-dark">7,096</span> jobs found</div>
                            <div class="d-flex align-items-center">
                                <div class="short-filter d-flex align-items-center">
                                    <div class="text-dark fw-500 me-2">Short:</div>
                                    <select class="nice-select">
                                        <option value="0">Latest</option>
                                        <option value="1">Category</option>
                                        <option value="2">Job Type</option>
                                    </select>
                                </div>
                                <button class="style-changer-btn text-center rounded-circle tran3s ms-2 list-btn" title="Active List"><i class="bi bi-list"></i></button>
                                <button class="style-changer-btn text-center rounded-circle tran3s ms-2 grid-btn active" title="Active Grid"><i class="bi bi-grid"></i></button>
                            </div>
                        </div>
                        <!-- /.upper-filter -->
                        <div class="accordion-box list-style show">
                            <div class="job-list-one style-two position-relative border-style mb-20">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-md-5">
                                        <div class="job-title d-flex align-items-center">
                                            <a href="job-details-v1.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_22.png" alt="" class="lazy-img m-auto"></a>
                                            <div class="split-box1">
                                                <a href="job-details-v1.html" class="job-duration fw-500">Fulltime</a>
                                                <a href="job-details-v1.html" class="title fw-500 tran3s">Animator & 3D Artist.</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                        <div class="job-location">
                                            <a href="job-details-v1.html">Spain, Bercelona</a>
                                        </div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$30-$50</span> / hour . Intermediate</div>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <div class="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
                                            <a href="job-details-v1.html" class="save-btn text-center rounded-circle tran3s me-3" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                            <a href="job-details-v1.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.job-list-one -->
                            <div class="job-list-one style-two position-relative border-style mb-20">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-md-5">
                                        <div class="job-title d-flex align-items-center">
                                            <a href="job-details-v1.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_23.png" alt="" class="lazy-img m-auto"></a>
                                            <div class="split-box1">
                                                <a href="job-details-v1.html" class="job-duration fw-500">Fulltime</a>
                                                <a href="job-details-v1.html" class="title fw-500 tran3s">Marketing Specialist.</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                        <div class="job-location">
                                            <a href="job-details-v1.html">US, New York</a>
                                        </div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$22k-$30k</span> / year . Expert</div>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <div class="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
                                            <a href="job-details-v1.html" class="save-btn text-center rounded-circle tran3s me-3" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                            <a href="job-details-v1.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.job-list-one -->
                            <div class="job-list-one style-two position-relative border-style mb-20">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-md-5">
                                        <div class="job-title d-flex align-items-center">
                                            <a href="job-details-v1.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_24.png" alt="" class="lazy-img m-auto"></a>
                                            <div class="split-box1">
                                                <a href="job-details-v1.html" class="job-duration fw-500 part-time">Part-time</a>
                                                <a href="job-details-v1.html" class="title fw-500 tran3s">Web Desginer.</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                        <div class="job-location">
                                            <a href="job-details-v1.html">Rome, Italy</a>
                                        </div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$400-$550</span> / week . Expert</div>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <div class="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
                                            <a href="job-details-v1.html" class="save-btn text-center rounded-circle tran3s me-3" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                            <a href="job-details-v1.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.job-list-one -->
                            <div class="job-list-one style-two position-relative border-style mb-20">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-md-5">
                                        <div class="job-title d-flex align-items-center">
                                            <a href="job-details-v1.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_25.png" alt="" class="lazy-img m-auto"></a>
                                            <div class="split-box1">
                                                <a href="job-details-v1.html" class="job-duration fw-500">Fulltime</a>
                                                <a href="job-details-v1.html" class="title fw-500 tran3s">Javascript Developer</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                        <div class="job-location">
                                            <a href="job-details-v1.html">Milan, Italy</a>
                                        </div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$35k-$40k</span> / year . Beginner</div>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <div class="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
                                            <a href="job-details-v1.html" class="save-btn text-center rounded-circle tran3s me-3" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                            <a href="job-details-v1.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.job-list-one -->
                            <div class="job-list-one style-two position-relative border-style mb-20">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-md-5">
                                        <div class="job-title d-flex align-items-center">
                                            <a href="job-details-v1.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_26.png" alt="" class="lazy-img m-auto"></a>
                                            <div class="split-box1">
                                                <a href="job-details-v1.html" class="job-duration fw-500">Fulltime</a>
                                                <a href="job-details-v1.html" class="title fw-500 tran3s">Inbound Call service.</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                        <div class="job-location">
                                            <a href="job-details-v1.html">UK, London</a>
                                        </div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$30-$50</span> / hour . Intermediate</div>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <div class="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
                                            <a href="job-details-v1.html" class="save-btn text-center rounded-circle tran3s me-3" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                            <a href="job-details-v1.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.job-list-one -->
                            <div class="job-list-one style-two position-relative border-style mb-20">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-md-5">
                                        <div class="job-title d-flex align-items-center">
                                            <a href="job-details-v1.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_33.png" alt="" class="lazy-img m-auto"></a>
                                            <div class="split-box1">
                                                <a href="job-details-v1.html" class="job-duration fw-500 part-time">Part-time</a>
                                                <a href="job-details-v1.html" class="title fw-500 tran3s">Document Typing.</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                        <div class="job-location">
                                            <a href="job-details-v1.html">UAE, Dubai</a>
                                        </div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$3k-$4k</span> / month . Expert</div>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <div class="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
                                            <a href="job-details-v1.html" class="save-btn text-center rounded-circle tran3s me-3" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                            <a href="job-details-v1.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.job-list-one -->
                            <div class="job-list-one style-two position-relative border-style mb-20">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-md-5">
                                        <div class="job-title d-flex align-items-center">
                                            <a href="job-details-v1.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_34.png" alt="" class="lazy-img m-auto"></a>
                                            <div class="split-box1">
                                                <a href="job-details-v1.html" class="job-duration fw-500 part-time">Part-time</a>
                                                <a href="job-details-v1.html" class="title fw-500 tran3s">Hotel Manager</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                        <div class="job-location">
                                            <a href="job-details-v1.html">AUS, Sydney</a>
                                        </div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$30-$50</span> / hour . Intermediate</div>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <div class="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
                                            <a href="job-details-v1.html" class="save-btn text-center rounded-circle tran3s me-3" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                            <a href="job-details-v1.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.job-list-one -->
                            <div class="job-list-one style-two position-relative border-style mb-20">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-md-5">
                                        <div class="job-title d-flex align-items-center">
                                            <a href="job-details-v1.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_35.png" alt="" class="lazy-img m-auto"></a>
                                            <div class="split-box1">
                                                <a href="job-details-v1.html" class="job-duration fw-500">Fulltime</a>
                                                <a href="job-details-v1.html" class="title fw-500 tran3s">Personal Assistant (HR)</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                        <div class="job-location">
                                            <a href="job-details-v1.html">USA, Alaska</a>
                                        </div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$20-$25</span> / hour . Intermediate</div>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <div class="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
                                            <a href="job-details-v1.html" class="save-btn text-center rounded-circle tran3s me-3" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                            <a href="job-details-v1.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.job-list-one -->
                            <div class="job-list-one style-two position-relative border-style mb-30">
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-md-5">
                                        <div class="job-title d-flex align-items-center">
                                            <a href="job-details-v1.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_36.png" alt="" class="lazy-img m-auto"></a>
                                            <div class="split-box1">
                                                <a href="job-details-v1.html" class="job-duration fw-500">Fulltime</a>
                                                <a href="job-details-v1.html" class="title fw-500 tran3s">Interactive Designer.</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-6">
                                        <div class="job-location">
                                            <a href="job-details-v1.html">USA, California</a>
                                        </div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$250-$300</span> / week . Expert</div>
                                    </div>
                                    <div class="col-md-3 col-sm-6">
                                        <div class="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
                                            <a href="job-details-v1.html" class="save-btn text-center rounded-circle tran3s me-3" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                            <a href="job-details-v1.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.job-list-one -->
                        </div>

                        
                        <div class="accordion-box grid-style">
                            <div class="row">
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_22.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500">Fulltime</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Lead designer & expert in maya 3D</a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$300-$450</span> / Week</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">USA, California</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_23.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500 part-time">Part-time</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Developer & expert in c++ & java.</a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$10-$15</span> / Hour</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">USA, Alaska</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_24.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500 part-time">Part-time</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Marketing specialist in SEO & Affiliate. </a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$40k</span> / Yearly</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">AUS, Sydney</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_25.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500">Fulltime</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Lead & Product & Web Designer.</a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$2k-3k</span> / Month</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">UAE, Dubai</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_26.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500">Fulltime</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Hotel Manager with PHD in Hms.</a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$40k-$60k</span> / Year</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">UK, London</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_33.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500 part-time">Part-time</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Interactive Designer.</a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$30-$35</span> / Hour</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">Milan, Italy</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_34.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500 part-time">Part-time</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Accountant Bookkeeper Financial Reporting</a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$300-$450</span> / Week</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">US, Alaska</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_35.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500">Fulltime</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Personal assistants/ ARC readers needed</a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$2000</span> / Month</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">Rome, Italy</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_36.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500">Fulltime</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Hotel Manager with PHD in Hms.</a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$40k-$60k</span> / Year</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">US, New York</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                                <div class="col-sm-6 mb-30">
                                    <div class="job-list-two style-two position-relative">
                                        <a href="job-details-v2.html" class="logo"><img src="images/lazy.svg" data-src="images/logo/media_37.png" alt="" class="lazy-img m-auto"></a>
                                        <a href="job-details-v2.html" class="save-btn text-center rounded-circle tran3s" title="Save Job"><i class="bi bi-bookmark-dash"></i></a>
                                        <div><a href="job-details-v2.html" class="job-duration fw-500 part-time">Part-time</a></div>
                                        <div><a href="job-details-v2.html" class="title fw-500 tran3s">Amazon Product Research</a></div>
                                        <div class="job-salary"><span class="fw-500 text-dark">$15-$20</span> / Hour</div>
                                        <div class="d-flex align-items-center justify-content-between mt-auto">
                                            <div class="job-location"><a href="job-details-v2.html">Germany, Hamburg</a></div>
                                            <a href="job-details-v2.html" class="apply-btn text-center tran3s">APPLY</a>
                                        </div>
                                    </div> <!-- /.job-list-two -->
                                </div>
                            </div>
                        </div>
                        <!-- /.accordion-box -->

                        <div class="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                            <p class="m0 order-sm-last text-center text-sm-start xs-pb-20">Showing <span class="text-dark fw-500">1 to 20</span> of <span class="text-dark fw-500">7,096</span></p>
                            <ul class="pagination-one d-flex align-items-center justify-content-center justify-content-sm-start style-none">
                                <li class="active"><a href="#">1</a></li>
                                <li><a href="#">2</a></li>
                                <li><a href="#">3</a></li>
                                <li><a href="#">4</a></li>
                                <li>....</li>
                                <li class="ms-2"><a href="#" class="d-flex align-items-center">Last <img src="images/icon/icon_50.svg" alt="" class="ms-2"></a></li>
                            </ul>
                        </div>
                    </div>
                    <!-- /.job-post-item-wrapper -->
                </div>
                <!-- /.col- -->
            </div>
        </div>
    </section>

</div>