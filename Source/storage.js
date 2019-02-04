var CircleCIPrettifierStorage = {
  writeData: function(data, successCb) {
    chrome.storage.sync.set(
      {
        circlePrettifierData: data
      },
      successCb
    );
  },

  readData: function(successCb) {
    chrome.storage.sync.get('circlePrettifierData', function(data) {
      successCb(data.circlePrettifierData)
    });
  }
};
