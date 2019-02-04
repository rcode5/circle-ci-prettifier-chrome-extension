var CircleCIPrettifier = {
  JOBS_STATUS: "JOBS_STATUS",
  WORKFLOWS_STATUS: "WORKFLOWS_STATUS",
  defaultSettings: {
    branches: 'goodies',
    failed: 'shit',
    success: 'rock on',
    succeeded: 'you rule!'
  },
  currentSettings: {},
  shouldSkipNode: function(node) {
    try {
      return (node.tagName.toLowerCase() == 'input') ||
        (node.tagName.toLowerCase() == 'textarea');
    } catch(ex) {
      return false;
    }
  },
  walkPage: function() {
    CircleCIPrettifier.walk(document.body);
  },
  stepIn: function(node) {
    var child, next;
    child = node.firstChild;
    while ( child )
    {
      next = child.nextSibling;
      CircleCIPrettifier.walk(child);
      child = next;
    }
  },
  guessCircleCiNodeType: function(node) {
    if (node.tagName == "DIV" && (node.classList.contains("status-icon"))) {
      return CircleCIPrettifier.JOBS_STATUS;
    }
    if (node.parentNode.tagName == "A" && node.parentNode.href.match(/\/workflow-run\/.*$/)) {
      return CircleCIPrettifier.WORKFLOWS_STATUS;
    }
  },
  walk: function(node) {
    // I stole this function from here:
    // http://is.gd/mwZp7E
    if (CircleCIPrettifier.shouldSkipNode(node)) {
      return;
    }

    switch ( node.nodeType )
    {
      case Node.DOCUMENT_NODE:
      case Node.DOCUMENT_FRAGMENT_NODE:
      CircleCIPrettifier.stepIn(node);
      break;
      case Node.ELEMENT_NODE:
      switch (CircleCIPrettifier.guessCircleCiNodeType(node)) {
      case CircleCIPrettifier.WORKFLOWS_STATUS:
      case CircleCIPrettifier.JOBS_STATUS:
        CircleCIPrettifier.handleStatusIcon(node);
      }
      CircleCIPrettifier.stepIn(node);
      break;
      case Node.TEXT_NODE:
      CircleCIPrettifier.handleText(node);
      break;
    }
  },
  getStatusFromNode: function(node) {
    var title;
    if (title = node.parentNode.title) {
      return title.toLowerCase();
    }
    if (node.tagName == "SPAN") {
      if (node.parentNode.innerHTML.match(/succe/i)) {
        return "success";
      }
      if (node.parentNode.innerHTML.match(/faile/i)) {
        return "failed";
      }
    }
    return null;
  },
  replaceIcon: function(node, status) { return; },
  handleStatusIcon: function(node) {
    var status = CircleCIPrettifier.getStatusFromNode(node);
    if (status) {
      CircleCIPrettifier.replaceIcon(node, status);
    }
  },
  handleText: function(textNode) {
    var v = textNode.nodeValue;
    var settings = CircleCIPrettifier.currentSettings;

    v = v.replace(/\bbranches\b/ig, settings.branches);
    v = v.replace(/\bfailed\b/ig, settings.failed);
    v = v.replace(/\bsuccess\b/ig, settings.success);
    v = v.replace(/\bsucceeded\b/ig, settings.succeeded);

    textNode.nodeValue = v;
  },
  mergeSettings: function(settings) {
    Object.keys(settings).forEach(function(key) {
      CircleCIPrettifier.currentSettings[key] = settings[key] ||
        CircleCIPrettifier.currentSettings[key] ||
        CircleCIPrettifier.defaultSettings[key];
    });
    console.log(settings, CircleCIPrettifier.defaultSettings, CircleCIPrettifier.currentSettings);
  }
};

document.addEventListener("DOMNodeInserted", CircleCIPrettifierHelpers.throttle(
  function() {
    CircleCIPrettifierStorage.readData(function(data) {
      CircleCIPrettifier.mergeSettings(data);
      CircleCIPrettifier.walkPage();
    });
  },
  750
), false);
