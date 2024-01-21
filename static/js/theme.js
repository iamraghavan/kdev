!function($){"use strict";var timer;if($(window).on("scroll",(function(){$(this).scrollTop()>200?$(".scroll-top").fadeIn():$(".scroll-top").fadeOut()})),$(".scroll-top").on("click",(function(){return $("html, body").animate({scrollTop:0}),!1})),$(".lazy-img").length&&$(".lazy-img").Lazy({effect:"fadeIn",threshold:300}),$(".counter").length&&$(".counter").counterUp({delay:10,time:1200}),$(window).on("scroll",(function(){var sticky=$(".sticky-menu"),scroll;$(window).scrollTop()>=180?sticky.addClass("fixed"):sticky.removeClass("fixed")})),$("input,textarea").each((function(){$(this).data("holder",$(this).attr("placeholder")),$(this).on("focusin",(function(){$(this).attr("placeholder","")})),$(this).on("focusout",(function(){$(this).attr("placeholder",$(this).data("holder"))}))})),$(".product-gallery").length&&($("#list-btn").on("click",(function(){$(".item").addClass("list-style"),$(this).addClass("active"),$("#grid-btn").removeClass("active")})),$("#grid-btn").on("click",(function(){$(".item").removeClass("list-style"),$(this).addClass("active"),$("#list-btn").removeClass("active")}))),$(".more-btn").length&&$(".more-btn").on("click",(function(){let $more;$(this).siblings("ul").toggleClass("show").hasClass("show")?$(this).html('<i class="bi bi-dash"></i> Show Less'):$(this).html('<i class="bi bi-plus"></i> Show More')})),$(".style-changer-btn").length&&($(".list-btn").on("click",(function(){$(this).removeClass("active"),$(".grid-btn").addClass("active"),$(".grid-style").removeClass("show"),$(".list-style").addClass("show")})),$(".grid-btn").on("click",(function(){$(this).removeClass("active"),$(".list-btn").addClass("active"),$(".grid-style").addClass("show"),$(".list-style").removeClass("show")}))),$(".nice-select").length&&$(".nice-select").niceSelect(),$(".expert-slider-one").length&&$(".expert-slider-one").slick({dots:!1,arrows:!0,lazyLoad:"ondemand",prevArrow:$(".prev_a"),nextArrow:$(".next_a"),centerPadding:"0px",slidesToShow:4,slidesToScroll:1,autoplay:!0,autoplaySpeed:3e3,responsive:[{breakpoint:1200,settings:{slidesToShow:3}},{breakpoint:768,settings:{slidesToShow:2}}]}),$(".expert-slider-two").length&&$(".expert-slider-two").slick({dots:!0,arrows:!1,lazyLoad:"ondemand",centerPadding:"0px",slidesToShow:4,slidesToScroll:2,autoplay:!1,autoplaySpeed:3e3,responsive:[{breakpoint:1200,settings:{slidesToShow:3}},{breakpoint:992,settings:{slidesToShow:2}},{breakpoint:576,settings:{slidesToShow:1}}]}),$(".feedback-slider-one").length&&$(".feedback-slider-one").slick({dots:!1,arrows:!0,lazyLoad:"ondemand",prevArrow:$(".prev_b"),nextArrow:$(".next_b"),centerPadding:"0px",slidesToShow:2,slidesToScroll:1,autoplay:!0,autoplaySpeed:3e6,responsive:[{breakpoint:768,settings:{slidesToShow:1}}]}),$(".feedback-slider-two").length&&$(".feedback-slider-two").slick({dots:!0,arrows:!1,lazyLoad:"ondemand",centerPadding:"0px",slidesToShow:3,slidesToScroll:1,autoplay:!0,autoplaySpeed:3e5,responsive:[{breakpoint:768,settings:{slidesToShow:2}},{breakpoint:576,settings:{slidesToShow:1}}]}),$(".feedback-slider-three-a").length&&$(".feedback-slider-three-a").slick({dots:!1,arrows:!0,prevArrow:$(".prev_d"),nextArrow:$(".next_d"),lazyLoad:"ondemand",centerPadding:"0px",slidesToShow:1,slidesToScroll:1,autoplay:!0,fade:!0,autoplaySpeed:3e5,asNavFor:".feedback-slider-three-b"}),$(".feedback-slider-three-b").length&&$(".feedback-slider-three-b").slick({dots:!0,arrows:!1,lazyLoad:"ondemand",centerPadding:"0px",slidesToShow:3,slidesToScroll:1,autoplay:!0,autoplaySpeed:3e5,asNavFor:".feedback-slider-three-a",responsive:[{breakpoint:992,settings:{slidesToShow:2}},{breakpoint:576,settings:{slidesToShow:1}}]}),$(".partner-slider").length&&$(".partner-slider").slick({dots:!1,arrows:!1,lazyLoad:"ondemand",centerPadding:"0px",slidesToShow:6,slidesToScroll:1,autoplay:!0,autoplaySpeed:3500,responsive:[{breakpoint:1400,settings:{slidesToShow:5}},{breakpoint:768,settings:{slidesToShow:4}},{breakpoint:576,settings:{slidesToShow:3}}]}),$(".category-slider-one").length&&$(".category-slider-one").slick({dots:!1,arrows:!0,lazyLoad:"ondemand",prevArrow:$(".prev_d"),nextArrow:$(".next_d"),centerPadding:"0px",slidesToShow:4,slidesToScroll:1,autoplay:!0,autoplaySpeed:3e3,responsive:[{breakpoint:992,settings:{slidesToShow:3}},{breakpoint:768,settings:{slidesToShow:2}},{breakpoint:576,settings:{slidesToShow:1}}]}),$(".related-job-slider").length&&$(".related-job-slider").slick({dots:!1,arrows:!0,lazyLoad:"ondemand",prevArrow:$(".prev_e"),nextArrow:$(".next_e"),centerPadding:"0px",slidesToShow:3,slidesToScroll:1,autoplay:!0,autoplaySpeed:3e3,responsive:[{breakpoint:992,settings:{slidesToShow:2}},{breakpoint:768,settings:{slidesToShow:1}}]}),$(".company-review-slider").length&&$(".company-review-slider").slick({dots:!0,arrows:!1,lazyLoad:"ondemand",centerPadding:"0px",slidesToShow:2,slidesToScroll:1,autoplay:!0,autoplaySpeed:3e3,responsive:[{breakpoint:768,settings:{slidesToShow:1}}]}),$(".candidate-portfolio-slider").length&&$(".candidate-portfolio-slider").slick({dots:!0,arrows:!1,lazyLoad:"ondemand",centerPadding:"0px",slidesToShow:3,slidesToScroll:1,autoplay:!0,autoplaySpeed:3e3,responsive:[{breakpoint:992,settings:{slidesToShow:2}},{breakpoint:450,settings:{slidesToShow:1}}]}),$("#locationRange").length&&$("#locationRange").on("mousemove",(function(){$("#rangeValue").text($("#locationRange").val())})),$("#contact-form").length&&($("#contact-form").validator(),$("#contact-form").on("submit",(function(e){if(!e.isDefaultPrevented()){var url="inc/contact.php";return $.ajax({type:"POST",url:url,data:$(this).serialize(),success:function(data){var messageAlert="alert-"+data.type,messageText=data.message,alertBox='<div class="alert '+messageAlert+' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+messageText+"</div>";messageAlert&&messageText&&($("#contact-form").find(".messages").html(alertBox),$("#contact-form")[0].reset())}}),!1}}))),$(".user-data-form").length&&$(".passVicon").on("click",(function(){$(".passVicon").toggleClass("eye-slash");var input=$(".pass_log_id");"password"===input.attr("type")?input.attr("type","text"):input.attr("type","password")})),$(".dash-mobile-nav-toggler").length&&($(".dash-mobile-nav-toggler").on("click",(function(){$(".dash-aside-navbar").addClass("show")})),$(".dash-aside-navbar .close-btn").on("click",(function(){$(".dash-aside-navbar").removeClass("show")}))),$(window).on("load",(function(){var wow;$("#ctn-preloader").fadeOut(),$("#preloader").delay(350).fadeOut("slow"),$("body").delay(350).css({overflow:"visible"}),new WOW({boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0}).init();var fancy=$(".fancybox");if(fancy.length&&fancy.fancybox({arrows:!0,buttons:["zoom","slideShow","thumbs","close"],animationEffect:"zoom-in-out",transitionEffect:"zoom-in-out"}),$("#isotop-gallery-wrapper").length){var $grid=$("#isotop-gallery-wrapper").isotope({itemSelector:".isotop-item",percentPosition:!0,masonry:{columnWidth:".grid-sizer"}});$(".isotop-menu-wrapper").on("click","li",(function(){var filterValue=$(this).attr("data-filter");$grid.isotope({filter:filterValue})})),$(".isotop-menu-wrapper").each((function(i,buttonGroup){var $buttonGroup=$(buttonGroup);$buttonGroup.on("click","li",(function(){$buttonGroup.find(".is-checked").removeClass("is-checked"),$(this).addClass("is-checked")}))}))}})),$(".salary-slider").length){const rangeInput=document.querySelectorAll(".range-input input"),priceInput=document.querySelectorAll(".price-input input"),range=document.querySelector(".slider .progress");let priceGap=10;priceInput.forEach(input=>{input.addEventListener("input",e=>{let minPrice=parseInt(priceInput[0].value),maxPrice=parseInt(priceInput[1].value);maxPrice-minPrice>=priceGap&&maxPrice<=rangeInput[1].max&&("input-min"===e.target.className?(rangeInput[0].value=minPrice,range.style.left=minPrice/rangeInput[0].max*100+"%"):(rangeInput[1].value=maxPrice,range.style.right=100-maxPrice/rangeInput[1].max*100+"%"))})}),rangeInput.forEach(input=>{input.addEventListener("input",e=>{let minVal=parseInt(rangeInput[0].value),maxVal=parseInt(rangeInput[1].value);maxVal-minVal<priceGap?"range-min"===e.target.className?rangeInput[0].value=maxVal-priceGap:rangeInput[1].value=minVal+priceGap:(priceInput[0].value=minVal,priceInput[1].value=maxVal,range.style.left=minVal/rangeInput[0].max*100+"%",range.style.right=100-maxVal/rangeInput[1].max*100+"%")})})}}(jQuery);