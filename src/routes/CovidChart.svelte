<svelte:head>
  
</svelte:head>


<script>

  import { afterUpdate } from 'svelte';
  import Banner from "../components/InnerBanner.svelte";
  import HealthNews from './HealthNews.svelte';
  import Chart from 'chart.js/auto';


  let pageLinks = [
    { text: 'Home', url: '/' },
    { text: 'Covid - 19' },
  ];

  function createChart() {
    // Fetch COVID-19 data
    fetch('https://data.covid19india.org/v4/min/data.min.json')
      .then(response => response.json())
      .then(data => {
        // Extract the relevant data from the API response
        const timeline = data[Object.keys(data)[0]].total;
        const dates = Object.keys(timeline);
        const totalCases = dates.map(date => timeline[date]);

        // Create a Chart.js line chart
        const ctx = document.getElementById('covidChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [{
              label: 'Total Cases',
              data: totalCases,
              borderColor: 'blue',
              fill: false,
            }],
          },
          options: {
            responsive: true, // Make the chart responsive
            maintainAspectRatio: false,
            title: {
              display: true,
              text: 'COVID-19 Statistics in India',
            },
          },
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  afterUpdate(createChart);
</script>

<style>
  #covidChart {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Arial', sans-serif;
  }
</style>

<Banner title="Covid - 19" {pageLinks} />
<div class="main-page-wrapper">
  <section class="company-profiles bg-color pt-90 lg-pt-70 pb-160 xl-pb-150 lg-pb-80">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="accordion-box list-style show">
            <canvas id="covidChart"></canvas>
          </div>
        </div>
        <div class="col-12">
          <div class="accordion-box list-style show">
            <!-- Additional content can be added here -->
          </div>
        </div>
      </div>
    </div>
  </section>
</div>


<HealthNews />