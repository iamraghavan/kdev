<script>
	export let status;
	export let error;
  
	const dev = process.env.NODE_ENV === 'development';
  
	import { goto } from '@sapper/app';
  
	const goBack = () => {
	  goto('/');
	};
  
	// Determine the image, text, and description based on the error status
	const getImage = () => {
	  if (status >= 400 && status < 500) {
		return { src: 'https://kurudhi-assets.s3.ap-south-1.amazonaws.com/404-1.svg', alt: 'Client Error Image' };
	  } else if (status >= 500 && status < 600) {
		return { src: 'https://kurudhi-assets.s3.ap-south-1.amazonaws.com/server-error-image.svg', alt: 'Server Error Image' };
	  } else {
		// Default image if no specific condition is met
		return { src: 'https://kurudhi-assets.s3.ap-south-1.amazonaws.com/default-error-image.svg', alt: 'Default Error Image' };
	  }
	};
  
	const getText = () => {
	  if (status >= 400 && status < 500) {
		return 'Client Error';
	  } else if (status >= 500 && status < 600) {
		return 'Server Error';
	  } else {
		// Default text if no specific condition is met
		return 'Error';
	  }
	};
  
	const getDescription = () => {
	  if (status >= 400 && status < 500) {
		return 'Client error occurred. Please check your request.';
	  } else if (status >= 500 && status < 600) {
		return 'Server error occurred. We apologize for the inconvenience.';
	  } else {
		// Default description if no specific condition is met
		return 'An error occurred. Please try again later.';
	  }
	};
  </script>
  
  <svelte:head>
	<title>{status}</title>
  </svelte:head>
  
  <div class="error-page d-flex align-items-center justify-content-center">
	<div class="container">
	  <div class="row align-items-center">
		<div class="col-xl-5 col-md-6 ms-auto order-md-last">
		  <div class="error">{status}</div>
		  <h2>{getText()}</h2>
		  <p class="text-md">{getDescription()}</p>
		  <button on:click={goBack} class="btn-one w-100 d-flex align-items-center justify-content-between mt-30">
			<span>GO BACK</span>
			<img src="images/icon/icon_61.svg" alt="">
		  </button>
		</div>
		<div class="col-md-6 order-md-first">
		  <!-- Use the dynamic image source based on the error -->
		  <img src={getImage().src} alt={getImage().alt} class="sm-mt-60">
		</div>
	  </div>
	</div>
  </div>
  

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if}
