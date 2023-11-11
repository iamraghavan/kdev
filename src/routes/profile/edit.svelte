<script>
    import { onMount } from 'svelte';
    import { getDatabase, ref, get, update } from 'firebase/database';
    import { auth } from '../../firebase'; // Update the path accordingly
    import { goto } from '@sapper/app';
    import Swal from 'sweetalert2';
    import { firebaseApp } from '../../firebase';
  
    const db = getDatabase(firebaseApp);
  
    let error = "";
  
    let user = {
      uid: '',
      name: '',
      gender: '',
      country: '',
      dateOfBirth: '',
      age: '',
      pincode: '',
      city: '',
      state: '',
      division: '',
      whatsappNum: '',
      email: '',
    };
  
    async function handlePincodeInput(event) {
      const input = event.target;
      user.pincode = input.value;
  
      if (user.pincode.length === 6) {
        await fetchAddressData();
      } else {
        error = "Invalid pincode. Please enter a valid 6-digit pincode.";
      }
    }
  
    async function fetchAddressData() {
      if (user.pincode.length === 6) {
        try {
          const apiUrl = `https://api.postalpincode.in/pincode/${user.pincode}`;
          const response = await fetch(apiUrl);
  
          if (!response.ok) {
            throw new Error("Invalid pincode. Please enter a valid 6-digit pincode.");
          }
  
          const data = await response.json();
  
          if (data.length > 0 && data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            user.state = postOffice.State;
            user.division = postOffice.Division;
            user.city = postOffice.Name;
            error = "";
          } else {
            throw new Error("Invalid pincode. Please enter a valid 6-digit pincode.");
          }
        } catch (err) {
          error = err.message || "An error occurred while fetching data. Please try again.";
        }
      } else {
        error = "";
      }
    }
  
    const loadUserData = async (uid) => {
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
  
      user = {
        uid: uid,
        name: userData?.fullName || '',
        gender: userData?.gender || '',
        country: userData?.country || '',
        dateOfBirth: userData?.dateOfBirth || '',
        age: userData?.age ||'',
        pincode: userData?.pincode || '',
        city: userData?.city || '',
        state: userData?.state || '',
        division: userData?.division || '',
        whatsappNum : userData?.whatsapp || 'WhatsApp Number',
        email: userData?.email || '',
      };
    };
  
    onMount(async () => {
      const currentUser = auth.currentUser;
  
      if (!currentUser) {
        goto('/');
        return;
      }
  
      if (currentUser && currentUser.uid) {
        await loadUserData(currentUser.uid);
      }
    });
  
    const updateUser = async () => {
      if (!user || !user.uid) {
        return;
      }
  
      const userRef = ref(db, `users/${user.uid}`);
  
      const updatedUserData = {
        fullName: user.name,
        gender: user.gender,
        country: user.country,
        dateOfBirth: user.dateOfBirth,
        age: user.age,
        pincode: user.pincode,
        city: user.city,
        state: user.state,
        division: user.division,
        whatsapp: user.whatsappNum,
        email: user.email,
      };
  
      try {
        await update(userRef, updatedUserData);
  
        Swal.fire({
          icon: 'success',
          title: 'Data Updated Successfully!',
          showConfirmButton: false,
          timer: 2000,
        });
  
        goto(`/profile`);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error Updating Data',
          text: error.message,
        });
      }
    };
  </script>

<div class="main-page-wrapper">

    <div class="dashboard-body">
        <div class="position-relative">
     
            

            <h2 class="main-title px-3">Account Settings</h2>

            <div class="bg-white card-box border-20">
                <h4 class="dash-title-three">Edit &amp; Update</h4>
                <form action="#">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="dash-input-wrapper mb-20">
                                <label for="">Name</label>
                                <input type="text" id="name" bind:value={user.name} >
                            </div>
                            <!-- /.dash-input-wrapper -->
                        </div>
                        <div class="col-lg-6">
                            <div class="dash-input-wrapper mb-20">
                                <label for="">Gender</label>
                                <input type="text"  placeholder="" bind:value={user.gender}>
                            </div>
                            <!-- /.dash-input-wrapper -->
                        </div>
                       
                        <div class="col-lg-4">
                            <div class="dash-input-wrapper mb-20">
                                <label for="">Date of Birth</label>
                                <input type="date" placeholder="" bind:value={user.dateOfBirth}>
                            </div>
                            <!-- /.dash-input-wrapper -->
                        </div>
                        <div class="col-lg-3">
                            <div class="dash-input-wrapper mb-20">
                                <label for="">Age</label>
                                <input type="text" placeholder="" bind:value={user.age} >
                            </div>
                            <!-- /.dash-input-wrapper -->
                        </div>
                        <div class="col-lg-5">
                            <div class="dash-input-wrapper mb-20">
                                <label for="">Pincode</label>
                                <input type="text"
                                on:input={handlePincodeInput}
                          inputmode="numeric"
                          oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                          minlength="5"
                          maxlength="6"
                          pattern="[0-9]*" bind:value={user.pincode}>
                            </div>
                            <!-- /.dash-input-wrapper -->
                        </div>
                        {#if error}
                      <div class="alert alert-warning" role="alert">
                        {error}
                      </div>
                    {:else}
                      <div class="col-lg-4">
                        <div class="dash-input-wrapper mb-20">
                          <label for="country">Country</label>
                          <input
                            type="text"
                            disabled
                            placeholder="Country"
                            bind:value={user.country}
                            autocomplete="off"
                          />
                        </div>
                      </div>

                      <div class="col-lg-4">
                        <div class="dash-input-wrapper mb-20">
                          <label for="state">State</label>
                          <input
                            type="text"
                            disabled
                            placeholder="State"
                            bind:value={user.state}
                            autocomplete="off"
                          />
                        </div>
                      </div>

                      <div class="col-lg-4">
                        <div class="dash-input-wrapper mb-20">
                          <label for="state">Division</label>
                          <input
                            type="text"
                            disabled
                            placeholder="Division"
                            bind:value={user.division}
                            autocomplete="off"
                          />
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="dash-input-wrapper mb-20">
                          <label for="city">City</label>
                          <input
                            type="text"
                            disabled
                            placeholder="City"
                            bind:value={user.city}
                            autocomplete="off"
                          />
                        </div>
                      </div>
                    {/if}
                        
                    </div>

                    <div class="button-group d-inline-flex align-items-center mt-30">
                        <a href="/" class="dash-btn-two tran3s me-3 rounded-3">Save</a>
                        <a href="/" class="dash-cancel-btn tran3s">Cancel</a>
                    </div>	
                </form>
            </div>
            <!-- /.card-box -->				
        </div>
    </div>
</div>

// uid: uid,
//         name: userData?.fullName || '', 
//         gender: userData?.gender || '',
//         country: userData?.country || '',
//         dateOfBirth: userData?.dateOfBirth || '',
//         age: userData?.age ||'',
//         pincode: userData?.pincode || '',
//         city: userData?.city || '',
//         state: userData?.state || '',
//         age: userData?.age || '',
//         whatsappNum : userData?.whatsapp || 'WhatsApp Number',
//         division: userData?.division || '',
//         email: userData?.email || '',