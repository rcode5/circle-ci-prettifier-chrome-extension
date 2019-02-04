var CircleCIPrettifier = {
  JOBS_STATUS: "JOBS_STATUS",
  WORKFLOWS_STATUS: "WORKFLOWS_STATUS",
  defaultSettings: {
    branches: 'goodies',
    canceled: 'nevermind',
    failed: 'rats',
    queued: 'here we go',
    running: 'working on it',
    succeeded: 'you rule!',
    success: 'rock on',
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
    var filter = /branches|running|failed|succe|queue|cancel/i;
    if (!v.match(filter)) {
      return;
    }
    var matches = [
      [/\bbranches\b/ig, settings.branches],
      [/\bcanceled\b/ig, settings.canceled],
      [/\bfailed\b/ig, settings.failed],
      [/\bqueued\b/ig, settings.queued],
      [/\brunning\b/ig, settings.running],
      [/\bsucceeded\b/ig, settings.succeeded],
      [/\bsuccess\b/ig, settings.success],
      [/\bsuccessful\b/ig, settings.succeeded],
    ];
    var len = matches.length;
    var ii = 0;
    for(; ii < len; ++ii) {
      v = v.replace(matches[ii][0], matches[ii][1]);
    }
    textNode.nodeValue = v;
  },
  mergeSettings: function(settings) {
    Object.keys(CircleCIPrettifier.defaultSettings).forEach(function(key) {
      CircleCIPrettifier.currentSettings[key] = settings[key] ||
        CircleCIPrettifier.currentSettings[key] ||
        CircleCIPrettifier.defaultSettings[key];
    });
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
