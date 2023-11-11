<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css"
    integrity="sha512-oAvZuuYVzkcTc2dH5z1ZJup5OmSQ000qlfRvuoTTiyTBjwX1faoyearj8KdMq0LgsBTHMrRuMek7s+CxF8yE+w=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />

</svelte:head>

<script>
  // import { link } from '@sapper/app';

  import { onMount, setContext } from 'svelte';
  import { auth } from '../firebase';
  import { getDatabase, ref, get } from 'firebase/database';
  import { onAuthStateChanged } from 'firebase/auth';
  import { writable } from 'svelte/store';
  import { goto } from '@sapper/app';
  import { navigationEvent } from './navigation';

  import { onDestroy } from 'svelte';
// import { navigationEvent } from './navigation';

let updateCount = 0;

onMount(() => {
  const unsubscribe = navigationEvent.subscribe((event) => {
    if (event === 'navigate') {
      // Trigger a refresh or update in the header
      updateCount += 1;
    }
  });

  return () => {
    unsubscribe();
  };
});

onDestroy(() => {
  // Cleanup if needed
});


  onMount(() => {
  // Example: Trigger the event when navigating to a different route
  document.querySelector('a').addEventListener('click', () => {
    navigationEvent.set('navigate');
  });
});

  import { firebaseApp } from '../firebase';

  const db = getDatabase(firebaseApp);
  let userData = null;
  let userDisplayName = null;

  // Create a writable store to share user data
  const userContext = writable(null);

  function toCapitalizedCase(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

  onMount(() => {
    // Listen for changes in user authentication state
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User is not authenticated, you may want to handle this case
        userContext.set(null); // Set user data to null
        return;
      }

      const uid = user.uid;
      const userRef = ref(db, 'users/' + uid);

      // Fetch user data
      const snapshot = await get(userRef);
      userData = snapshot.val();
   
    
      userDisplayName = userData.fullName;
      


      userContext.set(userDisplayName);
       // Set user data in the store
    });
  });

  // Function to handle logout

  const handleLogout = async () => {
    // Perform any additional logout logic if needed

    // Clear the session (remove the flag from local storage)
    localStorage.removeItem('userLoggedIn');

    auth.signOut().then(() => {
      goto('/');
    });
  };

  // Check for stored authentication state on component mount
  onMount(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');

    if (userLoggedIn) {
      // goto('/profile');
      console.log('User already logged in.');
    }
  });

  // Share the user context with child components
  setContext('userContext', userContext);

  let mobHeaderLogo = {
    src: "./images/logo/logo_04.png",
    alt: "Logo Image",
    width: "100",
    style: "width: 14rem; height: auto;"
  }

  let logoImage = {
    src: "images/logo/logo_04.png",
    alt: "Logo Image",
    style: "width: 14rem; height: auto; padding-bottom: 7px;"
  };

  function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning ☀️😊';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon 🌞👋🍵';
    } else {
      return 'Good Evening 🍵🕰️';
    }
  }
</script>

<header class="theme-main-menu menu-overlay sticky-menu">
  <div class="inner-content position-relative">
    <div class="top-header">
      <div class="d-flex align-items-center">
        <div class="logo order-lg-0">
          <a href="/" class="d-flex align-items-center">
            <img style={logoImage.style} src={logoImage.src} alt={logoImage.alt}>
          </a>
        </div>
        {#if $userContext !== null}
        <div class="right-widget ms-auto ms-lg-0 order-lg-2">
          <ul class="d-flex align-items-center style-none">
            
            <li class="d-none d-md-block ms-4">
              <!-- Display the user's full name and create a dropdown menu -->
              <div class="nav-item dropdown">
                <a class="dropdown-toggle fw-500 text-dark" data-bs-theme="dark" href="/" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  {getGreeting()}, <span style="color: #ff0000;
                  text-transform: capitalize;
                  font-family: 'McLaren';"> {$userContext} </span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="userDropdown">
                  <!-- Add navigation links to profile and dashboard pages -->
                  <li><a href="/profile" class="dropdown-item">Profile</a></li>
                  <li><a href on:click={handleLogout} class="dropdown-item fw-500 text-dark">Logout</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        {:else}
        <div class="right-widget ms-auto ms-lg-0 order-lg-2">
          <ul class="d-flex align-items-center style-none">
            <li class="d-none d-md-block ms-4">
              <a href="/login" class="fw-500 text-dark">Login</a>
            </li>
            <li class="d-none d-md-block ms-4">
              <a href="/register" class="btn-five">Register</a>
            </li>
          </ul>
        </div>
    
        {/if}
        <nav class="navbar navbar-expand-lg p0 me-lg-auto ms-3 ms-lg-5 order-lg-1">
          <button
            class="navbar-toggler d-block d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="d-block d-lg-none">
                <div class="logo">
                  <a href="/" class="d-block">
                    <img style={mobHeaderLogo.style} src={mobHeaderLogo.src} alt={mobHeaderLogo.alt} width={mobHeaderLogo.width}>
                  </a>
                </div>
              </li>
              <li class="nav-item dropdown">
                <a href="/" class="nav-link" role="button" data-bs-auto-close="outside" aria-expanded="false">Home</a>
              </li>
              <li class="nav-item dropdown">
                <a href="/about" class="nav-link" role="button" data-bs-auto-close="outside" aria-expanded="false">About us</a>
              </li>
              <li class="nav-item dropdown mega-dropdown-sm">
                <a class="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Blood Donar
                </a>
                <ul class="dropdown-menu">
                  <li class="row gx-1">
                    <div class="col-md-6">
                      <div class="menu-column">
                        <h6 class="mega-menu-title">Manage My Donations
                          
                          
                          
                          </h6>
                        <ul class="style-none mega-dropdown-list">
                         
                          <li><a href="company-v1.html" class="dropdown-item"><span>My Profile</span></a></li>
                          <li><a href="company-v2.html" class="dropdown-item"><span>Forget Donar Account</span></a></li>
                          <!-- <li><a href="company-v3.html" class="dropdown-item"><span>Go to My Profile</span></a></li> -->
                          <li><a href="company-v4.html" class="dropdown-item"><span>Get Digital Donor Card</span></a></li>
                          
                      </ul>
                      </div> 
                    </div>
                    <div class="col-md-6">
                      <div class="menu-column">
                        <h6 class="mega-menu-title">How to Donate</h6>
                        <ul class="style-none mega-dropdown-list">
                          <li><a href="candidates-v1.html" class="dropdown-item"><span>Find a Blood Drive</span></a></li>
                          <li><a href="candidates-v2.html" class="dropdown-item"><span>Eligibility  Requirements</span></a></li>
                          <li><a href="candidates-v3.html" class="dropdown-item"><span>Types of Blood Donations</span></a></li>
                          <li><a href="candidates-v4.html" class="dropdown-item"><span>Learn About Blood</span></a></li>
                          


                        </ul>
                      </div> 
                    </div>
                    
                  </li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown"
                  data-bs-auto-close="outside" aria-expanded="false">Find a Donar
                </a>
                <ul class="dropdown-menu">
                  <li><a href="blog-v1.html" class="dropdown-item"><span>Blog Standard</span></a></li>
                  <li><a href="blog-v2.html" class="dropdown-item"><span>Blog Grid</span></a></li>
                  <li><a href="blog-v3.html" class="dropdown-item"><span>Blog Full width</span></a></li>
                  <li><a href="blog-details.html" class="dropdown-item"><span>Blog Details</span></a></li>
                </ul> 
              </li>

              <li class="nav-item">
                <a class="nav-link" href="contact.html" role="button">Contact</a>
              </li>
              {#if $userContext !== null}
              <li class="nav-item dropdown d-md-none mt-5">
                <a class="dropdown-toggle fw-500 text-dark" data-bs-theme="dark" href="/" role="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  {getGreeting()}, <br> <span style="font-size: 1.5rem;
                  text-transform: capitalize;
                  color: #ff0000;
                  font-family: 'McLaren';
                  font-weight: 600;"> {$userContext} </span>
                </a>
                <ul class="dropdown-menu">
                  <li><a href="/profile" class="dropdown-item">Profile</a></li>
  <li><a href on:click={handleLogout} class="dropdown-item fw-500 text-dark">Logout</a></li>
                </ul> 
              </li>
              {:else}
            
              <li class="d-md-none mt-5"><a href="/login" class="btn-five w-100">Login</a></li>
              {/if}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </div>
</header>



