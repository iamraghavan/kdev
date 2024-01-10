<script>
    import { onMount } from 'svelte';
    import axios from 'axios';

    let inputValue = '';
    let suggestions = [];
    let selectedSuggestion = null;
    let map;
    let showDefaultMap = true;

    const nominatimApiUrl = 'https://nominatim.openstreetmap.org/search';

    const fetchLocationSuggestions = async () => {
        try {
            // ... (unchanged code)
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSuggestionClick = (city) => {
        selectedSuggestion = city;

        // Clear existing markers
        if (map) {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    layer.remove();
                }
            });

            // Add a marker for the selected location
            const selectedLocation = suggestions.find((s) => s.name === city);
            if (selectedLocation) {
                const marker = L.marker([selectedLocation.lat, selectedLocation.lon]).addTo(map);

                // Center the map to the selected location
                map.setView([selectedLocation.lat, selectedLocation.lon], 15);

                // Set to false to hide the default map
                showDefaultMap = false;
            }
        }
    };

    const handleKeyDown = (event, suggestion) => {
        if (event.key === 'Enter') {
            handleSuggestionClick(suggestion);
        }
    };

    const openInOpenStreetMap = () => {
        // Open the selected location in OpenStreetMap
        if (selectedSuggestion) {
            const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${selectedSuggestion.lat}&mlon=${selectedSuggestion.lon}#map=15/${selectedSuggestion.lat}/${selectedSuggestion.lon}`;
            window.open(openStreetMapUrl, '_blank');
        }
    };

    onMount(() => {
        // Initialize the map when the component mounts (client-side)
        if (typeof window !== 'undefined') {
            import('leaflet').then((L) => {
                map = L.map('map').setView([0, 0], 2);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

                // Show the default map only if showDefaultMap is true
                if (showDefaultMap) {
                    map.setView([0, 0], 2);
                }
            });
        }
    });
</script>

<style>
    /* Your existing styles remain unchanged */
</style>

<div style="padding-top: 10rem;">
    <div id="map-container">
        <div id="input-container">
            <input
                type="text"
                bind:value={inputValue}
                placeholder="Enter location..."
                on:input={fetchLocationSuggestions}
            />
            {#if suggestions.length > 0 && !selectedSuggestion}
                <div class="suggestions">
                    {#each suggestions as { name, key }}
                        <div
                            class="suggestion-item"
                            on:click={() => handleSuggestionClick(name)}
                            on:keydown={(event) => handleKeyDown(event, name)}
                            tabindex="0"
                            role="button"
                            aria-label={`Select ${name}`}
                            {key}
                        >
                            {name}
                        </div>
                    {/each}
                </div>
            {/if}
            {#if selectedSuggestion}
                <button on:click={openInOpenStreetMap}>Open in OpenStreetMap</button>
            {/if}
        </div>

        
        <div class="inner-banner-one position-relative pb-0">
			<div class="map-banner">
                <div class="gmap_canvas h-100 w-100">
                    <div  id="map"></div>

                </div>
            </div>
			
		</div>
    </div>
</div>
