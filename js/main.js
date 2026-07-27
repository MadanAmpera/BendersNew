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
