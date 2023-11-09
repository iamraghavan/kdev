<script>

	let searchInput = "";
	
  
	function search() {
	  // Handle the search functionality here
	  console.log("Search for:", searchInput);
	}
  
  </script>
  
  <div class="main-page-wrapper">
  
		
		<div class="hero-banner-five position-relative pt-200 lg-pt-150">
		  <div class="container">
			<div class="position-relative">
			  <div class="row">
				<div class="col-lg-6 col-md-8">
				  <h1>Join our cause and help us save <br>  more lives.</h1>
				  <p class="text-md mt-40 lg-mt-20 mb-65 lg-mb-30 pe-xxl-5">Find blood donors near your location and make a blood request in less than a minutes.</p>
				</div>
			  </div>
			  <div class="position-relative">
				<div class="row">
				  <div class="col-lg-6 col-md-8">
					<div class="job-search-two position-relative me-xxl-5">
					  <form on:submit|preventDefault={search} class="d-flex align-items-center justify-content-between">
						<input type="text" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')"  minlength="5"
						maxlength="6" pattern="[0-9]*" placeholder="Enter your Pincode" bind:value={searchInput} autocomplete="off" class="bg-grey">
						<button class="btn-five h-100">Search</button>
					  </form>
					</div>
					
				  </div>
				</div>
			  </div>
			  <div class="d-sm-flex align-items-center mt-85 lg-mt-50">
				<img src="images/assets/screen_15.png" data-src="" alt="" class="lazy-img">
				<div class="ps-3">
				  <div class="fw-500 text-dark text-md">18k+</div>
				  <div>Individual Donars</div>
				</div>
			  </div>
			</div>
		  </div>
		  <div class="img-meta">
			<img src="images/shape/shape_29.svg" data-src="" alt="" class="lazy-img shapes shape_01">
		  </div>
		
		</div>
		
	   
		
  
  </div>  
  
  
  