import util from './util';

class Cards {
  constructor() {
    this.cards = [...document.querySelectorAll('.main-card')];
    this.logo = document.querySelector('.logo');
    this.fistCard = 'main-card about-us';
    this.init();
  }

  init() {
    const cardHandling = util.debounce((item) => {
      this.expandCard(item);
    }, 500, true);

    this.cards.forEach((card) => {
      card.addEventListener('click', () => {
        cardHandling(card);
      });
    });
  }

  expandCard(item) {
    item.classList.toggle('active');
    // getting the next card to show in fllscreen
    if (!item.classList.contains('active')) {
      const nextElement = document.getElementsByClassName(item.className)[0].nextElementSibling;
      if (!nextElement) {
        // nextElement = document.getElementsByClassName(this.fistCard)[0];
        item.classList.toggle('active');
      } else {
        nextElement.classList.toggle('active');
        nextElement.classList.toggle('inactive');
      }
    }
    // hide the rest of the cards
    this.cards.forEach((card) => {
      if (!card.classList.contains('active')) {
        card.classList.add('inactive');
        this.logo.classList.add('hidden');
      }
    });
  }

}

// single instance pattern, so it won't be new twice on app.js and logo.js
export let cards = new Cards;
