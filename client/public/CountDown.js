let interval;

self.onmessage = function(event) {
  let timeLeft = event.data;

  interval = setInterval(() => {
    timeLeft--;
    self.postMessage(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(interval);
    }
  }, 1000);
};

self.onclose = function() {
  clearInterval(interval);
};
