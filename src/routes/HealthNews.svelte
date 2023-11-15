<!-- src/routes/CoronavirusNews.svelte -->
<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
  
    let newsData = [];
  
    onMount(async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything?q=coronavirus&apiKey=dd47df614c2e429f85847d6a84da31e5');
        newsData = response.data.articles;
  
        // Shuffle the array to get random posts
        shuffleArray(newsData);
  
        // Display only the first 6 posts
        newsData = newsData.slice(0, 6);
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    });
  
    // Function to shuffle the array
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  </script>
  
  <style>
    /* Add your styles here */
  </style>
  
  <section class="blog-section-two pt-120 xl-pt-150 lg-pt-100 pb-150 xl-pb-130 lg-pb-80">
    <div class="container">
      <div class="position-relative">
        <div class="title-one text-center mb-30 lg-mb-10">
          <h2 class="fw-600">Article</h2>
        </div>
  
        <div class="row gx-xxl-5">
          {#each newsData as news (news.title)}
          <div class="col-lg-4 d-none d-lg-block">
            <article class="blog-meta-one mt-35 wow fadeInUp" data-wow-delay="0.19s" style="visibility: visible; animation-delay: 0.19s; animation-name: fadeInUp;">
              <figure class="post-img m0">
                <a href={news.url} class="w-100 d-block"><img src={news.urlToImage} alt={news.title} class="lazy-img w-100 tran4s" style=""></a>
              </figure>
              <div class="post-data mt-30 lg-mt-20">
                <a href="blog-details.html" class="mt-10 mb-25 lg-mb-20"><h4 class="tran3s blog-title">{news.title}</h4></a>
                <div><a href={news.url} target="_blank" rel="noopener noreferrer" class="btn-seven">Read More</a></div>
              </div>
            </article>
          </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
  