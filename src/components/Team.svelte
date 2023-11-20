<script>
    let experts = [
      {
        name: "Mr. Hajee Sharif",
        role: "Founder @ Kurudhi",
      },
      {
        name: "Mr.Murali Ganesan",
        role: "Accounts Manager @ CURI Hospital",
      },
      {
        name: "Aram Seiya Virumbu Trust",
        role: "Non-governmental organization",
      },
      
      {
        name: "Mr. Arjun",
        role: "Marketing Specialist",
      },
      {
        name: "Mr. Raghavan",
        role: "DevOps Engineer",
      },
    ];
  </script>
  
  <section class="expert-section-one position-relative mb-50 mt-30 xl-mt-10 lg-mt-1000">
    <div class="container position-relative">
      <div class="row">
        <div class="col-md-7">
          <div class="title-one text-center text-md-start mb-65 md-mb-50">
            <h2>
                People Behind
            </h2>
          </div>
        </div>
      </div>
  
      <div class="row">
        {#each experts as { name, role }, i (i)}
          <div class="mt-30 mb-30 col-md-4" key={i}>
            <div class="card-style-three text-center">
              <a href="/" class="name text-md fw-500 text-dark" tabindex="-1">
                {name}
              </a>
              <div class="post">{role}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  