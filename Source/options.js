function getForm() {
  return document.getElementById('circlePrettifier__optionsForm');
}

function getFormData() {
  var form = getForm();
  return({
    success: form.querySelector("#successReplacement").value,
    failed: form.querySelector("#failedReplacement").value,
    branch: form.querySelector("#branchReplacement").value
  });
}

function setFormData(data) {
  var form = getForm();
  var settings = data.circlePrettifierData;

  ["success", "failed", "branch"].forEach( function(key) {
    var value = settings[key];
    if (value) {
      var input = form.querySelector("#" + key + "Replacement");
      if (input) {
        input.value = value;
      }
    }
  });
}

function loadOptions() {
  chrome.storage.sync.get('circlePrettifierData', setFormData);
}

function saveOptions(e) {
  e.preventDefault();

  chrome.storage.sync.set(
    {circlePrettifierData: getFormData()},
    function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('circlePrettifier__status');
      status.textContent = 'Saved!';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  loadOptions();
  var form = getForm().addEventListener("submit", saveOptions, false);
});
