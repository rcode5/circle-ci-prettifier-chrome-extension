function getForm() {
  return document.getElementById('circlePrettifier__optionsForm');
}

function getFormData() {
  var form = getForm();
  return({
    success: form.querySelector("#successReplacement").value,
    succeeded: form.querySelector("#succeededReplacement").value,
    failed: form.querySelector("#failedReplacement").value,
    branches: form.querySelector("#branchesReplacement").value
  });
}

function setFormData(settings) {
  var form = getForm();

  ["succeeded", "success", "failed", "branches"].forEach( function(key) {
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
  readDataFromStorage(setFormData);
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
