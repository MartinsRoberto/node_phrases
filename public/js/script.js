const btnMobile = document.querySelector('.btn-mobile')

btnMobile.addEventListener('click', () => {
  document.querySelector('.nav').classList.toggle('active')
})