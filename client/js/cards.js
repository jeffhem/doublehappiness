import util from './util';
import {nav} from './nav';

class Cards {
  constructor() {
    this.main = document.querySelector('.main');
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

  expandCard(item, clickFromNav = false) {
    this.main.classList.remove('hidden');
    if (clickFromNav) {
      if (!item.classList.contains('active')) {
        this.cards.forEach((card) => {
          card.classList.remove('active');
        });
        item.classList.remove('inactive');
        // item.style.display = 'block';
      } else {
        // do nothing when click on the active menu item
        return;
      }
    }
    item.classList.toggle('active');
    // getting the next card to show in fllscreen
    if (!item.classList.contains('active') && !clickFromNav) {
      const nextElement = document.getElementsByClassName(item.className)[0].nextElementSibling;
      if (!nextElement) {
        // nextElement = document.getElementsByClassName(this.fistCard)[0];
        item.classList.toggle('active');
      } else {
        nextElement.classList.toggle('active');
        nextElement.classList.toggle('inactive');
        // nextElement.style.display = 'block';
      }
    }
    // hide the rest of the cards
    this.cards.forEach((card) => {
      if (!card.classList.contains('active')) {
        card.classList.add('inactive');
        card.addEventListener('transitionend', (e) => {
          if (this.logo.classList.contains('shrink') && e.target.classList.contains('inactive')){
            // e.target.style.display = 'none';
          }
        });
      } else {
        // show and highlight current nav
        nav.showNav();
        nav.highlightCurrent(card.dataset.current);
      }
    });
    // shrink logo
    this.logo.classList.add('shrink');
  }

  collapseCards() {
    this.main.classList.add('hidden');
    this.cards.forEach((card) => {
      card.classList.remove('active');
      card.classList.remove('inactive');
      // card.style.display = 'block';
    });
    nav.showNav(false);
    this.logo.classList.remove('shrink');
  }

}

// single instance pattern, so it won't be new twice on app.js and logo.js
export let cards = new Cards;
