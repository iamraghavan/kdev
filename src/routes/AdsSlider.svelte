<script context="module" lang="ts">
    import { ref, listAll, getDownloadURL, getStorage } from 'firebase/storage';
    import { firebaseApp } from "../firebase";
  </script>
  
  <script>
    import { onMount } from 'svelte';
  
    let images = [];
    let currentIndex = 0;
  
    async function fetchImages() {
      const storage = getStorage(firebaseApp);
      const storageRef = ref(storage, 'Slider');
  
      try {
        const files = await listAll(storageRef);
  
        images = await Promise.all(files.items.map(async (file) => {
          const url = await getDownloadURL(file);
          return { id: file.name, url, alt: 'Image Alt Text' };
        }));
      } catch (error) {
        console.error('Error fetching images:', error.message);
      }
    }
  
    onMount(fetchImages);
  
    // Automatically cycle through images every 2 seconds
    setInterval(() => {
      if (images.length > 0) {
        currentIndex = (currentIndex + 1) % images.length;
      }
    }, 5000);
  </script>
  
  <div class="category-list mb-60 lg-mb-40">
    {#if images.length > 0}
      <img src={images[currentIndex].url} alt={images[currentIndex].alt} />
    {:else}
      <p>No images found.</p>
    {/if}
  </div>
  