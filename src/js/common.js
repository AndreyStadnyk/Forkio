document.addEventListener('click', function(e){
    console.log(e.target);
    e.preventDefault();
    if (e.target.closest('.toggle__menu')) {
        console.log('OK = ', e.target.closest('.toggle__menu'));
        document.getElementsByClassName('toggle')
        [0].classList.toggle('navbar__active')
    }else{
        console.log(e.target.closest('.toggle__menu'));
    }
})