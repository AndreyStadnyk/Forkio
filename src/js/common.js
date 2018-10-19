document.addEventListener('click', function(e){
    
    if (e.target.closest('.toggle__menu')) {
        
        document.getElementsByClassName('header__toggle')
        [0].classList.toggle('header__navbar-active')
    }
})