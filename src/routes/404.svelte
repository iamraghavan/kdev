<script>
    import { goto } from '@sapper/app';
  
    async function goBack() {
      goto('/');
    };
  </script>
  
  <div class="error-page d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-xl-5 col-md-6 ms-auto order-md-last">
          <div class="error">404</div>
          <h2>Page Not Found</h2>
          <p class="text-md">
            Can not find what you need? Take a moment and do a search below or start from our Homepage.
          </p>
          <a href="/" on:click={goBack} class="btn-one w-100 d-flex align-items-center justify-content-between mt-30">
            <span>GO BACK</span>
            <img src="images/icon/icon_61.svg" alt="">
          </a>
        </div>
        <div class="col-md-6 order-md-first">
          <img src="https://kurudhi-assets.s3.ap-south-1.amazonaws.com/404-1.svg" alt="" class="sm-mt-60">
        </div>
      </div>
    </div>
  </div>
  