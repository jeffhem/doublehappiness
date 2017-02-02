import {nav} from './nav';

class Hamburger {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.globalNav = document.querySelector('.global-nav');
    this.init();
  }

  init() {
    this.hamburger.addEventListener('click', (evt) => {
      this.hamburger.classList.toggle('active');
      nav.toggleSlide();
    });
  }

  showHamburger(show) {
    if(show) {
      this.hamburger.classList.add('show');
    } else {
      this.hamburger.classList.remove('show');
    }
  }

}

export let hamburger = new Hamburger;