<script>
    import { getContext } from 'svelte';
    import Swal from 'sweetalert2';
    import { onMount } from 'svelte';
  
    import Footer from '../components/Footer.svelte';
    import Nav from '../components/Nav.svelte';

    let segment;
  
    // Function to show SweetAlert for internet connection status
    function checkInternetConnection() {
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        Swal.fire({
          icon: 'info',
          title: 'Oh No! No Internet Connection',
          text: 'Uh-oh! Seems like the internet is taking a nap. Check your connection and try again, Buddyyy.',
        });
      }
    }
  
    onMount(() => {
      // Attach the function to the window's online and offline events
      window.addEventListener('online', checkInternetConnection);
      window.addEventListener('offline', checkInternetConnection);
  
      // Call the function on component mount to check the initial internet connection status
      checkInternetConnection();
  
      // Use getContext to get the current segment
      const context = getContext('svelte');
      if (context) {
        ({ segment } = context.getContext('route') || {});
      }
    });
  </script>
  
  <style>
    /* Your styles go here */
  </style>
  
  {#if segment !== 'profile'}
    <Nav/>
  {/if}
  
  <main>
    <slot></slot>
  </main>
  
  {#if segment !== 'profile'}
    <Footer />
  {/if}
  