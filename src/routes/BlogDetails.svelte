<script context="module" lang="ts">
   export async function preload({ params, query }) {
        // Get the current request path
        const path = params.splat ? params.splat.join('/') : '';
        const queryStr = new URLSearchParams(query).toString();

        // Construct the current URL
        const currentUrl = `${path}${queryStr ? `?${queryStr}` : ''}`;

        // Store the URL in session for client-side access
        return {
            session: {
                url: currentUrl,
            },
            title: 'First-Time Blood Donors: A Lifesaving Journey',
            description: 'Every two seconds, someone in India is in need of blood. This staggering statistic underscores the constant demand for this life-sustaining resource. Hospitals, emergency rooms, and medical facilities rely on the generosity of donors to maintain an adequate blood supply for various medical procedures, surgeries, and treatments.',
            image: './images/First-Time-Blood-Donors-A-Lifesaving-Journey.jpg',
        };
    }
</script>
<script>
    export let blogData;
  
    let commentName = '';
    let commentEmail = '';
    let commentText = '';

    export let title;
    export let description;
    export let session;


    // Access the URL from session on the client side
    const url = session?.url;
  
  

  </script>
  
  <style>
    /* Add your styles here */
  </style>
  
  <section class="blog-section pt-100 lg-pt-80">
    <div class="container">
      <div class="border-bottom pb-160 xl-pb-130 lg-pb-80">
        <div class="row">
          <div class="col-lg-12">
            <div class="blog-details-page pe-xxl-5 me-xxl-3">
              {#if blogData}
                <article class="blog-details-meta">
            
                  <h2 class="blog-heading">{blogData.title}</h2>
                  <div class="img-meta mb-15"><img src={blogData.image} alt={blogData.title} class="lazy-img" style=""></div>
                  {@html blogData.content}
                  <div class="bottom-widget border-bottom d-sm-flex align-items-center justify-content-between">
                    
                    <ul class="d-flex share-icon align-items-center style-none pb-20">
                      <li>Share:</li>

                      <li><a href={`https://www.linkedin.com/shareArticle?url=${url}&title=${title}&summary=${description}`} target="_blank"><i class="bi bi-linkedin"></i></a></li>
                      <li><a href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`} target="_blank"><i class="bi bi-twitter"></i></a></li>
                      <li><a href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`} target="_blank"><i class="bi bi-whatsapp"></i></a></li>
              
                      
                    </ul>
                  </div>
                </article>
               
        
              {/if}
            </div>
          </div>
  
        
        </div>
      </div>
    </div>
  </section>