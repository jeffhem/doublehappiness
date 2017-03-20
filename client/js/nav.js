import {cards} from './cards';

class Nav {
  constructor() {
    this.navContainer = document.querySelector('.global-nav');
    this.navItems = [...this.navContainer.querySelectorAll('li')];
    this.navAction();
    this.mediaQueryHandeler();
  }

  mediaQueryHandeler() {
    if (matchMedia) {
      const mq = window.matchMedia("(max-width: 768px)");
      mq.addListener(this.WidthChange);
      this.WidthChange(mq);
    }
  }

  WidthChange(mq) {
    if (mq.matches) {
      document.querySelector('.global-nav').classList.add('shrink');
    } else {
      const mainCards = [...document.querySelectorAll('.main-card')];
      const onCards = mainCards.some((card) => {
        return card.classList.contains('active');
      })

      if (!onCards) {
        document.querySelector('.global-nav').classList.remove('shrink');
      }
    }
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
      if(window.innerWidth > 768 || document.body.clientWidth > 768) {
        this.navContainer.classList.remove('shrink');
      }
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