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
  },

  // xhr
  createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
      return new XMLHttpRequest();
    } else {
      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {
        try {
          return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
          console.warn('not able to create xhr');
        }
      }
    }
    return null;
  },

  xhrGet(url, callback, errback){
    const xhr = this.createXHR();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          callback(this.parseJson(xhr.responseText));
        } else {
          errback('service not available');
        }
      }
    };
    
    xhr.timeout = 100000;
    xhr.ontimeout = errback;
    xhr.send();
  },

  xhrPut(url, data, callback, errback) {
    const xhr = this.createXHR();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          callback();
        } else {
          errback('service not available');
        }
      }
    };
    xhr.timeout = 100000;
    xhr.ontimeout = errback;
    xhr.send(objectToQuery(data));
  },

  xhrAttach(url, data, callback, errback) {
    const xhr = this.createXHR();
    xhr.open('POST', url, true);
    //xhr.setRequestHeader("Content-type", "multipart/form-data");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          callback(this.parseJson(xhr.responseText));
        } else {
          errback('service not available');
        }
      }
    };
    xhr.timeout = 1000000;
    xhr.ontimeout = errback;
    xhr.send(data);
  },

  xhrPost(url, data, callback, errback) {
    const xhr = this.createXHR();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          callback(this.parseJson(xhr.responseText));
        } else {
          if (xhr.status == 409) {
            errback({status: '409', body: this.parseJson(xhr.responseText)[0]});
          } else {
            errback('service not available');
          }
        }
      }
    };
    xhr.timeout = 100000;
    xhr.ontimeout = errback;
    xhr.send(JSON.stringify(data));
  },

  xhrDelete(url, callback, errback) {	
    const xhr = this.createXHR();
    xhr.open('DELETE', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          callback();
        } else {
          errback('service not available');
        }
      }
    };
    xhr.timeout = 100000;
    xhr.ontimeout = errback;
    xhr.send();
  },

  parseJson(str) {
    return window.JSON ? JSON.parse(str) : eval('(' + str + ')');
  },

  objectToQuery(map) {
    const enc = encodeURIComponent;
    const pairs = [];
    for (let name in map){
      const value = map[name];
      const assign = enc(name) + '=';
      if (value && (value instanceof Array || typeof value == 'array')) {
        for (let i = 0, len = value.length; i < len; ++i) {
          pairs.push(assign + enc(value[i]));
        }
      } else {
        pairs.push(assign + enc(value));
      }
    }
    return pairs.join('&');
  },
};

export default util;
