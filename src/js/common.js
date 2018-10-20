document.addEventListener('click', function(e){
    
    if (e.target.closest('.toggle__menu')) {
        
        document.getElementsByClassName('toggle')
        [0].classList.toggle('navbar__active')
    }
})