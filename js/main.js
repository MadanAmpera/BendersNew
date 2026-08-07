const mediaQuery = window.matchMedia('(min-width: 769px)');

function handleMediaQueryChange(event){
    if(event.matches){
        document.getElementById('tours-root-nav').addEventListener('click', function(){
            document.getElementById('tours-nav-links').classList.remove('global-nav__tour-links-hide');
            document.getElementById('tours-nav-links').classList.add('global-nav__tour-links-show');
        });

        document.addEventListener('click', event =>{
            let isClickInside = document.getElementById('tours-root-nav').contains(event.target) || document.getElementById('tours-nav-links').contains(event.target);

            if(!isClickInside){
                document.getElementById('tours-nav-links').classList.remove('global-nav__tour-links-show');
                document.getElementById('tours-nav-links').classList.add('global-nav__tour-links-hide');
            }
        });

        //adding sticky to navigation links
        document.getElementById('global-header').classList.remove('sticky');
        document.getElementById('nav-header').classList.add('sticky');
    }
    else{
        //adding sticky to global header
        document.getElementById('nav-header').classList.remove('sticky');
        document.getElementById('global-header').classList.add('sticky');
    }
}

handleMediaQueryChange(mediaQuery);

window.onresize = function(){
    handleMediaQueryChange(mediaQuery);
}

function showMobileMenu(){
    document.getElementById('mobile-menu').classList.remove('mobile-nav-hide');
    document.getElementById('mobile-menu').classList.add('mobile-nav-show');
}

function hideMobileMenu(){
    document.getElementById('mobile-menu').classList.remove('mobile-nav-show');
    document.getElementById('mobile-menu').classList.add('mobile-nav-hide');
}

function openBookingModal(){
    document.getElementById('booking-modal-overlay').classList.remove('booking-modal-hide');
    document.getElementById('booking-modal-overlay').classList.add('booking-modal-show');
    document.body.classList.add('booking-modal-open');
    // nudge the embedded widget in case it sized itself while hidden
    window.dispatchEvent(new Event('resize'));
}

function closeBookingModal(){
    document.getElementById('booking-modal-overlay').classList.remove('booking-modal-show');
    document.getElementById('booking-modal-overlay').classList.add('booking-modal-hide');
    document.body.classList.remove('booking-modal-open');
}

function closeBookingModalOnOverlay(event){
    if(event.target.id === 'booking-modal-overlay'){
        closeBookingModal();
    }
}

document.addEventListener('keydown', function(event){
    if(event.key === 'Escape'){
        closeBookingModal();
    }
});
