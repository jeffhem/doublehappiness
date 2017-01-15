import {cards} from './cards';

class Logo {
  constructor() {
    this.logo = document.querySelector('.logo');
    this.rsvpCard = document.getElementsByClassName('main-card rsvp')[0];
    this.init();
  }

  init() {
    this.logo.addEventListener('click', () => {
      cards.expandCard(this.rsvpCard);
    });
  }
}

export default Logo;
