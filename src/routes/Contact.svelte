<script>
      import Banner from "../components/InnerBanner.svelte";
</script>

<div class="main-page-wrapper">

    <div>
        <Banner title="Contact our Team"  />
        <!-- Other content for the "About" page -->
      </div>

    <section class="contact-us-section pt-10 lg-pt-30">
        <div class="container">
            <div class="border-bottom pb-20 lg-pb-20">
         
               

                <div class="row">
                    <div class="col-xl-9 m-auto">
                        <div class="form-style-one mt-85 lg-mt-50 wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">
                            <form action="inc/contact.php" id="contact-form" data-toggle="validator" novalidate="true">
                                <div class="messages"></div>
                                <div class="row controls">
                                    <div class="col-sm-6">
                                        <div class="input-group-meta form-group mb-30">
                                            <label for="">Name*</label>
                                            <input type="text" placeholder="Your Name*" name="name" required="required" data-error="Name is required.">
                                            <div class="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="input-group-meta form-group mb-30">
                                            <label for="">Email*</label>
                                            <input type="email" placeholder="Email Address*" name="email" required="required" data-error="Valid email is required.">
                                            <div class="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="input-group-meta form-group mb-35">
                                            <label for="">Subject (optional)</label>
                                            <input type="text" placeholder="Write about the subject here.." name="subject">
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="input-group-meta form-group mb-35">
                                            <textarea placeholder="Your message*" name="message" required="required" data-error="Please,leave us a message."></textarea>
                                            <div class="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div class="col-12"><button class="btn-eleven fw-500 tran3s d-block">Send Message</button></div>
                                </div>
                            </form>
                        </div> <!-- /.form-style-one -->
                    </div>
                </div>
            </div>
        </div>
    </section>

</div>