<svelte:head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>About Kurudhi.com Empowering Lives Through Blood Donation</title>
  <meta name="description" content="Discover the heart behind Kurudhi.com – your go-to platform connecting blood donors with recipients. Join our mission of saving lives and fostering hope.">
  <meta name="author" content="J S Raghavan">
  <meta name="copyright" content="J S Raghavan">
  <meta name="robots" content="index, follow">
</svelte:head>

<script>
  import BloodCta from "../components/BloodCTA.svelte"
  import HowWorks from "../components/HowWorks.svelte";
  import Banner from "../components/InnerBanner.svelte";
  import Team from "../components/Team.svelte";
  
  let pageLinks = [
    { text: 'Home', url: '/' },
    { text: 'About' },
  ];

  let accordionItems = {
    ac1 : {
      title: "What is Kurudhi.com?",
      description: "Kurudhi.com is a dedicated online platform designed to revolutionize blood donation and supply by connecting donors and recipients in a streamlined, efficient, and user-friendly manner. The name Kurudhi itself is derived from the Tamil word for blood, emphasizing the primary focus of the website."
    },
    ac2 : {
      title: "Why Choose Kurudhi.com?",
      description: "Kurudhi.com is built with a user-centric approach, making it easy for blood donors and recipients to find the right match quickly. By utilizing modern technology, we reduce the time and effort needed to arrange blood donations."
    },
    ac3 : {
      title: "Impact of Kurudhi.com",
      description: "Through Kurudhi.com, countless lives have been saved by connecting donors with recipients during emergencies, surgeries, and medical treatments."
    }
  }

  function toggleAccordionItem(item) {
    item.collapsed = !item.collapsed;
  }

  let counters = [
    { count: 7, label: 'million', description: 'Completed Jobs' },
    { count: 30, label: 'k+', description: 'Worldwide Clients' },
    { count: 13, label: 'billion', description: 'Dollar Payout' },
  ];
</script>

<div class="main-page-wrapper">
  <div>
    <Banner title="About us" {pageLinks} />
  </div>

  <section class="text-feature-three position-relative pt-80 lg-pt-30 md-pt-14">
    <div class="container">
      <div class="row">
        <div class="col-xxl-11 m-auto">
          <div class="row">
            <div class="col-lg-5">
              <div class="title-one mt-30 md-mb-40">
                <h2 class="fw-600" style="font-size: 4.7rem;">We’ve been helping customers globally.</h2>
              </div>
            </div>
            <div class="col-lg-6 ms-auto">
              <div class="wow fadeInRight">
                <div class="accordion accordion-style-one color-two ps-xxl-5 ms-xxl-4" id="accordionOne">
					<div class="accordion-item">
						<div class="accordion-header" id="headingOne">
							  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
								{accordionItems.ac1.title}
							  </button>
						</div>
						<div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionOne">
							<div class="accordion-body">
								<p>{accordionItems.ac1.description}</p>
							</div>
						</div>
					  </div>
					  <div class="accordion-item">
						<div class="accordion-header" id="headingTwo">
							  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
								{accordionItems.ac2.title}
							  </button>
						</div>
						<div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionOne">
							  <div class="accordion-body">
								<p>{accordionItems.ac2.description}</p>
							</div>
						</div>
					  </div>
					  <div class="accordion-item">
						<div class="accordion-header" id="headingThree">
							  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
								{accordionItems.ac3.title}
							  </button>
						</div>
						<div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionOne">
							  <div class="accordion-body">
								<p>{accordionItems.ac3.description}</p>
							</div>
						</div>
					  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="border-bottom pb-50 lg-pb-10">
            <div class="row">
              <!-- {#each counters as counter (counter.count)}
                <div class="col-sm-4">
                  <div class="counter-block-one mt-25 text-center wow fadeInUp">
                    <h2 class="main-count fw-500"><span class="counter">{counter.count}</span>{counter.label}</h2>
                    <p>{counter.description}</p>
                  </div>
                </div>
              {/each}  -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <HowWorks />

  <Team/>

  
  <BloodCta />



</div>
