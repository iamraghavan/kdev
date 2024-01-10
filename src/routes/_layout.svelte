<!-- __layout.svelte -->


<script>
  import Swal from 'sweetalert2';
  import { onMount } from 'svelte';
  import Footer from '../components/Footer.svelte';
  import Nav from '../components/Nav.svelte';

  export let segment;

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
    window.addEventListener('online', checkInternetConnection);
    window.addEventListener('offline', checkInternetConnection);
    checkInternetConnection();
  });
</script>

<style>
  /* Your styles go here */
</style>

<Nav {segment}/>

<main>
  <slot></slot>
</main>

<Footer />



