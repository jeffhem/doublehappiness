import {cards} from './cards';
import {nav} from './nav';

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
      } else {
        const rsvp = document.querySelector('.rsvp');
        cards.expandCard(rsvp);
      }
    });
  }
}

export default Logo;
