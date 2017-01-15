const util = {

  // debounce
  debounce(func, wait, immediate) {
    let timeout;
    return (...arg) => {
      const context = this;
      const args = arg;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

};

export default util;
