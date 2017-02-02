import {cards} from './cards';

class Nav {
  constructor() {
    this.navContainer = document.querySelector('.global-nav');
    this.navItems = [...this.navContainer.querySelectorAll('li')];
    this.navAction();
  }

  navAction() {
    this.navItems.forEach((item) => {
      const allCards = [...document.querySelectorAll('.main-card')];
      const card = document.querySelector(`[data-current="${item.dataset.nav}" ]`);
      item.addEventListener('click', (e) => {
        e.preventDefault();
        cards.expandCard(card, true);
      })
    })
  }

  showNav(show = true) {
    if (show) {
      this.navContainer.classList.add('shrink');
    } else {
      this.navContainer.classList.remove('shrink');
    }
  }

  highlightCurrent(currentCard) {
    this.resetCurrent();
    this.navItems.forEach((item) => {
      if (item.dataset.nav === currentCard) {
        item.classList.add('current');
      }
    });
  }

  resetCurrent() {
    this.navItems.forEach((item) => {
      item.classList.remove('current');
    });
  }

  toggleSlide() {
    this.navContainer.classList.toggle('slide-in');
  }
}

export let nav = new Nav;