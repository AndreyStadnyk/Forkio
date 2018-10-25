dropdown();

function dropdown(){
    document.addEventListener('click', function(e){
        e.preventDefault();
        if (e.target.closest('.toggle__menu')) {
            document.getElementsByClassName('toggle')
            [0].classList.toggle('navbar__active')
        }else{
        }
    })
}
