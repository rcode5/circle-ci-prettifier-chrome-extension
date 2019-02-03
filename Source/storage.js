function writeDataToStorage(data, successCb) {
  chrome.storage.sync.set(
    {
      circlePrettifierData: data
    },
    successCb
  );
}

function readDataFromStorage(successCb) {
  chrome.storage.sync.get('circlePrettifierData', function(data) {
    successCb(data.circlePrettifierData)
  });
}
