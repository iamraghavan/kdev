<script>
	import Footer from '../components/Footer.svelte';
import Nav from '../components/Nav.svelte';

</script>

<style>

</style>

<Nav />

<main class="main-page-wrapper">
	<slot></slot>
	
</main>


<footer>
    <!-- Include the Footer component here -->
    <Footer />
</footer>
