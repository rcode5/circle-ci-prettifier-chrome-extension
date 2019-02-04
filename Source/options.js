var CIRCLE_CI_PRETTIFIER_FIELDS = [
  "branches",
  "canceled",
  "failed",
  "failing",
  "not_running",
  "queued",
  "running",
  "succeeded",
  "success" ];

function getForm() {
  return document.getElementById('circlePrettifier__optionsForm');
}

function getFormData() {
  var form = getForm();
  return CIRCLE_CI_PRETTIFIER_FIELDS.reduce(function(memo, key) {
    memo[key] = form.querySelector("#" + key).value;
    return memo;
  }, {});
}

function setFormData(settings) {
  var form = getForm();

  CIRCLE_CI_PRETTIFIER_FIELDS.forEach( function(key) {
    var value = settings[key];
    if (value) {
      var input = form.querySelector("#" + key);
      if (input) {
        input.value = value;
      }
    }
  });
}

function loadOptions() {
  CircleCIPrettifierStorage.readData(setFormData);
}

function saveOptions(e) {
  e.preventDefault();
  CircleCIPrettifierStorage.writeData( getFormData(),
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
