
<script>
    export let blogData3;

    import { getDatabase, ref, get, set } from "firebase/database";
    import { onMount } from 'svelte';

 
    import { firebaseApp } from "../firebase";
    const db = getDatabase(firebaseApp);

    function viewUserProfile(uid) {
        event.preventDefault();
        console.log("UID before goto:", uid);
        goto(`donor/${uid}`, { state: { value: uid } });
    }

    let latestDonors = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

  

    onMount(async () => {
        try {
            const snapshot = await get(ref(db, 'users'));
            latestDonors = [];

            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                latestDonors.push({
                    uid: data.uid,
                    fullName: data.fullName,
                    gender: data.gender,
                    bloodGroup: data.bloodGroup,
                });
            });

            // Shuffle the array randomly
            latestDonors = shuffleArray(latestDonors);

            // Take the first 3 elements to show random 3 data
            latestDonors = latestDonors.slice(0, 3);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    });


    import Banner from "../components/InnerBanner.svelte";
  import AdsSlider from "./AdsSlider.svelte";

  </script>
  
  <style>
    /* Add your styles here */
  </style>

<div class="main-page-wrapper">
  <div>
    <Banner title={blogData3.title}  />
  </div>

  <section class="blog-section pt-10 lg-pt-80">
    <div class="container">
      <div class="border-bottom pb-160 xl-pb-130 lg-pb-80">
        <div class="row">
          <div class="col-lg-9">
            <div class="blog-details-page pe-xxl-5 me-xxl-3">
              {#if blogData3}
                <article class="blog-details-meta">
            
                
                  <div class="img-meta mb-15"><img src={blogData3.image} alt={blogData3.title} class="lazy-img" style=""></div>
                  {@html blogData3.content}
                  <div class="bottom-widget border-bottom d-sm-flex align-items-center justify-content-between">
                    
                    <ul class="d-flex share-icon align-items-center style-none pb-20">
                      <li>Share:</li>
                      <li><a href="/"><i class="bi bi-google"></i></a></li>
                      <li><a href="/"><i class="bi bi-twitter"></i></a></li>
                      <li><a href="/"><i class="bi bi-instagram"></i></a></li>
                    </ul>
                  </div>
                </article>
               
        
              {/if}
            </div>
          </div>
          <div class="col-lg-3">
            <div class="blog-sidebar ps-xl-4 md-mt-60">

              <div class="sidebar-recent-news mb-60 lg-mb-40">
                <h4 class="sidebar-title">Recent Donors</h4>
                {#each latestDonors as { uid, fullName, gender, bloodGroup }}
                <div class="news-block d-flex align-items-center pt-20 pb-20 border-top">
                  
                  
    <div class="post ps-4" key={uid}>
        <h4 class="mb-5"><a href on:click={() => viewUserProfile(uid)} class="title tran3s">{fullName}</a></h4>
        <div class="date">{gender} | {bloodGroup}</div>
    </div>

                </div>
                {/each}
                <div class="news-block d-flex align-items-center pt-20 pb-20 border-top">
                  
                  <div class="post ps-4">
                    <button class="d-none d-md-block ms-4"><a href="/register" style="min-width: 195px !important;" class="btn-five">Become a Donor</a></button>
                  </div>
                </div>
              
               
              </div>
            
              <AdsSlider/>
             
            
            </div>
            <!-- /.blog-sidebar -->
          </div>
        
        </div>
      </div>
    </div>
  </section>


</div>
  
