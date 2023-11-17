<!-- HowWorks.svelte -->

<script>
    let steps = [
      {
        icon: 'images/logo/icon_08.svg',
        title: 'Create Account',
        description: 'It’s very easy to open an account and start your journey.',
      },
      {
        icon: 'images/logo/icon_09.svg',
        title: 'Complete your profile',
        description: 'Complete your profile with all the info to get the attention of clients.',
      },
      {
        icon: 'images/logo/icon_10.svg',
        title: 'Apply job or hire',
        description: 'Apply and get your preferable jobs with all the requirements and get it.',
      }
    ];
  </script>
  
  <section class="how-it-works position-relative bg-color pt-110 lg-pt-80 pb-110 lg-pb-70">
    <div class="container">
      <div class="title-one text-center mb-65 lg-mb-40">
        <h2 class="text-white fw-900">How it’s <span class="position-relative">work? <img src="images/shape/shape_07_black.svg" alt="" class="lazy-img shapes shape" style=""></span></h2>
      </div>
  
      <div class="row justify-content-center">
        {#each steps as step (step)}
        <div class="col-xxl-3 col-lg-4 col-md-6">
          <div class="card-style-two text-center mt-25 wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">
            <div class="icon rounded-circle d-flex align-items-center justify-content-center m-auto">
              <img src={step.icon} alt="" class="lazy-img" style="">
            </div>
            <div class="title fw-500 text-white">{step.title}</div>
            <p class="text-white">{step.description}</p>
          </div>
          <!-- /.card-style-two -->
        </div>
        {/each}
      </div>
    </div>
    <img src="images/shape/shape_08_black.svg" alt="" class="lazy-img shapes shape_01" style="">
    <img src="images/shape/shape_09_black.svg" alt="" class="lazy-img shapes shape_02" style="">
  </section>
  