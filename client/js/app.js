const cards = [...document.querySelectorAll('.main-card')];
const logo = document.querySelector('.logo');
let loop = 4;

cards.forEach(card => {
  card.addEventListener('click', (e) => {
    card.classList.toggle('active');
    if (!card.classList.contains('active')) {
      console.log(card.className);
      console.log(document.getElementsByClassName(card.className))
      const nextElement = document.getElementsByClassName(card.className)[0].nextElementSibling;
      nextElement.classList.toggle('active');
      nextElement.classList.toggle('inactive');
      nextElement.style.display = 'block';
    }
    cards.forEach(item => {
      if (!item.classList.contains('active')) {
        item.classList.add('inactive');
        logo.classList.add('hidden');
        setTimeout(function() {
          item.style.display = 'none';
        }, 250);
      }
    })
  })
});
