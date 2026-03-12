(function ($) {
    "use strict";
    window.addEventListener("load",function(){
        var element = document.getElementById("loader-wrapper");
        var contenedor = this.document.getElementById("loader-wrapper");
        contenedor.style.display = 'none';
        element.style.display = 'none';
    })
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    $(window).on('scroll',function () {
        if ($(this).scrollTop() > 100) {
            $('.navbar').addClass('nav-sticky');
            $('.navbar').addClass('bg-light');
        } else {
            $('.navbar').removeClass('nav-sticky');
            $('.navbar').removeClass('bg-light');
        }
    });
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

        // Modal Video
        $(document).on('ready',function () {
            var $videoSrc;
            $('.btn-play').on('click',function () {
                $videoSrc = $(this).data("src");
            });
            console.log($videoSrc);
    
            $('#videoModal').on('shown.bs.modal', function (e) {
                $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
            })
    
            $('#videoModal').on('hide.bs.modal', function (e) {
                $("#video").attr('src', $videoSrc);
            })
        });


    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

    
function isVisible(elm) {
	var rect = elm.getBoundingClientRect();
	var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	return !(rect.bottom < -10 || rect.top - viewHeight >= 0);
}

// cuando se carga la página...
window.addEventListener('DOMContentLoaded', (ev0) => {
        // asignamos un evento scroll...
	window.addEventListener('scroll', (ev1) => {
                // y a todos los elementos con la clase paused...
		document.querySelectorAll(".paused").forEach(elm => {
			if (isVisible(elm)){ // que sean visibles...
				elm.classList.remove("paused"); // les quitamos la clase paused 
            }
		})
	});
});

  
    
})(jQuery);

