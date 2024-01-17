<svelte:head>
    <meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Requirements by Blood Donation Type in India - Kurudhi.com</title>
<meta name="description" content="Explore specific eligibility criteria and guidelines for various blood donation types in India at Kurudhi.com">
<meta name="author" content="J S Raghavan">
<meta name="copyright" content="Bumble Bees IT Solutions">
<meta name="robots" content="index, follow">
</svelte:head>

<script>
    import BloodCta from "../components/BloodCTA.svelte";

  import BlogDetails2 from "./BlogDetails2.svelte";
  
    // Define your blog data here or fetch it from an API
    let blogData2 = {
      title: "Requirements by Blood Donation Type in India",
      image:
        "./images/Requirements-by-Blood-Donation-Type-in-India.jpg",
      content: `
             
 

    <section>
        <div>
            <h5>Whole Blood Donation:</h5>
            <p><strong>Requirements:</strong></p>
            <ul>
                <li>Age: 18 to 65 years.</li>
                <li>Weight: Above 45 kg.</li>
                <li>Hemoglobin Level: Minimum 12.5 g/dL.</li>
                <li>Health: Generally good health with no infectious diseases.</li>
                <li>Donation Interval: Every 3 months for males and every 4 months for females.</li>
            </ul>
        </div>

        <!-- Repeat the above structure for other donation types -->

        <div>
            <h5>Directed Donation (Autologous Donation):</h5>
            <p><strong>Requirements:</strong></p>
            <ul>
                <li>Age: Determined by the treating physician.</li>
                <li>Weight: Sufficient to donate the required amount.</li>
                <li>Health: As per the treating physician's assessment.</li>
                <li>Donation Interval: As recommended by the treating physician.</li>
            </ul>
        </div>

        <div>
            <h5>Cord Blood Donation:</h5>
            <p><strong>Requirements:</strong></p>
            <ul>
                <li>Age: No age limit (for pregnant individuals).</li>
                <li>Health: Generally good health during pregnancy.</li>
                <li>Gestational Age: Between 28 and 34 weeks.</li>
                <li>Hemoglobin Level: Above 11 g/dL.</li>
            </ul>
        </div>
    </section>

    <footer>
        <p>Understanding these specific requirements ensures that individuals willing to donate blood are eligible and contribute to maintaining a robust blood supply in India. It is essential to consult with healthcare professionals or blood banks for precise information and guidance on eligibility and donation intervals. By meeting these requirements, donors play a crucial role in saving lives and supporting the healthcare system in India.</p>
    </footer>
  
  
              
          `,
    };
  </script>
  
  
  
  <BlogDetails2 {blogData2} />
  <BloodCta/>
  