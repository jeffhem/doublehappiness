import {cards} from './cards';
import {nav} from './nav';
import {hamburger} from './hamburger';

class Logo {
  constructor() {
    this.logo = document.querySelector('.logo');
    this.init();
  }

  init() {
    this.logo.addEventListener('click', (e) => {
      if (this.logo.classList.contains('shrink')){
        cards.collapseCards();
        nav.resetCurrent();
        hamburger.showHamburger(false);
      } else {
        const rsvp = document.querySelector('.rsvp');
        cards.expandCard(rsvp);
        hamburger.showHamburger(true);
      }
    });
  }
}

export default Logo;
