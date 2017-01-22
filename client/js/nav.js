import {cards} from './cards';

class Nav {
  constructor() {
    this.navContainer = document.querySelector('.global-nav');
    this.navItems = [...this.navContainer.querySelectorAll('li a')];
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
      this.navContainer.style.display = 'block';
    } else {
      this.navContainer.style.display = 'none';
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
}

export let nav = new Nav;