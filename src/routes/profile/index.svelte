<script>
  let userData;

  // Check if the code is running on the client side
  if (typeof window !== 'undefined') {
    // Check if localStorage is available
    if (window.localStorage) {
      // Parse userData from localStorage or set to an empty object
      userData = JSON.parse(localStorage.getItem('userData')) || {};
    } else {
      console.error('localStorage is not available.');
    }
  }
</script>

<!-- Your modified HTML code with a single root element -->
<div class="main-page-wrapper">
  <div class="inner-banner-one position-relative">
    <div class="container">
      <div class="candidate-profile-card list-layout bg-dark">
        <div class="d-flex align-items-start align-items-xl-center">
          <div class="right-side">
            <div class="row gx-1 align-items-center">
              <div class="col-xl-2 order-xl-0">
                <div class="position-relative">
                  <h4 class="candidate-name text-white mb-0" style="text-transform: capitalize;">
                    {userData ? userData.fullName : 'Name Not Available'}
                  </h4>
                  <div class="candidate-post">UI Designer</div>
                </div>
              </div>
              <!-- Add the rest of your code here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
