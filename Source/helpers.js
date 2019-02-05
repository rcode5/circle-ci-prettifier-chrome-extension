var CircleCIPrettifierHelpers = {
  debounce: function(func, delay) {
    var timerId = void 0;
    return function () {
      var args = arguments;

      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(function () {
        func.apply(undefined, args);
        timerId = null;
      }, delay);
    };
  },
  throttle: function(func, limit) {
    var lastFunc;
    var lastRan;
    return function() {
      var context = this;
      var args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }
}
