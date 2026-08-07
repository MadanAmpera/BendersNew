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

/* ---- polaroid stacks: match both photo collages to the real content
   height of the columns beside them ----
   CSS Grid stretches every column in the row to match the tallest one, so a
   column's own box height is not a reliable "how much room is there"
   signal — each helper below measures where the real content ends instead.
     - the main stack (page-photo-grid) trims trailing photos so it never
       outgrows the tour-info column's actual text/table/button height.
     - the itinerary stack does the opposite: it reveals photos one at a
       time to fill whatever space is left under the sketch, capped at
       whatever row height the other two columns already established.
   Both are desktop-only; mobile stacks the three sections vertically and
   needs none of this. */
function initPolaroidStacks(){
    const mainStack = document.querySelector('.polaroid-stack');
    const infoColumn = document.querySelector('.tour-info');
    const itineraryColumn = document.querySelector('.tour-itinerary');
    const itineraryStack = document.querySelector('.itinerary-polaroid-stack');
    const itinerarySvg = itineraryColumn ? itineraryColumn.querySelector('svg') : null;

    if(!mainStack && !itineraryStack){
        return;
    }

    const desktopQuery = window.matchMedia('(min-width: 769px)');
    const MIN_VISIBLE = 2; // floor for the main stack so it still reads as a collage
    const TOLERANCE = 24; // px — ignore near-misses either direction
    let resizeTimer;

    function infoContentHeight(){
        const lastItem = infoColumn.lastElementChild;
        if(!lastItem){
            return infoColumn.getBoundingClientRect().height;
        }
        return lastItem.getBoundingClientRect().bottom - infoColumn.getBoundingClientRect().top;
    }

    function fitMainStack(){
        if(!mainStack || !infoColumn){
            return;
        }
        const photos = Array.from(mainStack.querySelectorAll('.polaroid'));

        if(!desktopQuery.matches){
            photos.forEach(photo => photo.classList.remove('polaroid--js-hidden'));
            return;
        }

        // reset to the full set first so a taller info column (after resize
        // or a font swap) can bring previously-hidden photos back
        photos.forEach(photo => photo.classList.remove('polaroid--js-hidden'));

        let visible = photos.length;
        const targetHeight = infoContentHeight();
        while(visible > MIN_VISIBLE && mainStack.getBoundingClientRect().height > targetHeight + TOLERANCE){
            visible -= 1;
            photos[visible].classList.add('polaroid--js-hidden');
        }
    }

    function fitItineraryStack(){
        if(!itineraryStack || !itineraryColumn || !itinerarySvg){
            return;
        }
        const photos = Array.from(itineraryStack.querySelectorAll('.polaroid'));

        // always start from none showing so we can measure the column's own
        // natural height (title + sketch, nothing else) before adding back
        photos.forEach(photo => photo.classList.add('polaroid--js-hidden'));

        if(!desktopQuery.matches){
            return;
        }

        const rowHeight = itineraryColumn.getBoundingClientRect().height;
        const baseHeight = itinerarySvg.getBoundingClientRect().bottom - itineraryColumn.getBoundingClientRect().top;
        const available = rowHeight - baseHeight;

        for(let i = 0; i < photos.length; i++){
            photos[i].classList.remove('polaroid--js-hidden');
            if(itineraryStack.getBoundingClientRect().height > available - TOLERANCE){
                photos[i].classList.add('polaroid--js-hidden');
                break;
            }
        }
    }

    function fitAll(){
        // main stack settles first — the itinerary column's stretched
        // (grid-row) height depends on it having already been trimmed
        fitMainStack();
        fitItineraryStack();
    }

    fitAll();
    window.addEventListener('load', fitAll);
    if(document.fonts && document.fonts.ready){
        document.fonts.ready.then(fitAll);
    }
    window.addEventListener('resize', function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(fitAll, 150);
    });
}

initPolaroidStacks();
