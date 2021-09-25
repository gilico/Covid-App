function showInput(){
    document.getElementById('cityType').style.visibility = 'visible';
}
function showGeneralData(){
    document.getElementById('cityType').style.visibility = 'hidden';
}

var clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', (e) => {
    document.querySelectorAll('.data-cont').innerText = '';
    console.log('clear')
})

