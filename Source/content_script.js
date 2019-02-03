var currentSettings = {
  branches: 'goodies',
  failed: 'shit',
  success: 'rock on',
  succeeded: 'you rule!'
};

function throttle(func, limit) {
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
};

function shouldSkipNode(node) {
  try {
    return (node.tagName.toLowerCase() == 'input') ||
      (node.tagName.toLowerCase() == 'textarea');
  } catch(ex) {
    return false;
  }
};

function walkPage() {
  walk(document.body);
}

function stepIn(node) {
  var child, next;
  child = node.firstChild;
  while ( child )
  {
    next = child.nextSibling;
    walk(child);
    child = next;
  }
}

function isStatusIcon(node) {
  // on jobs page
  return false;
}

var JOBS_STATUS="JOBS_STATUS";
var WORKFLOWS_STATUS="WORKFLOWS_STATUS";

function guessCircleCiNodeType(node) {
  if (node.tagName == "DIV" && (node.classList.contains("status-icon"))) {
    return JOBS_STATUS;
  }
  if (node.parentNode.tagName == "A" && node.parentNode.href.match(/\/workflow-run\/.*$/)) {
    return WORKFLOWS_STATUS;
  }
}

function walk(node)
{
  // I stole this function from here:
  // http://is.gd/mwZp7E
  if (shouldSkipNode(node)) {
    return;
  }

  switch ( node.nodeType )
  {
    case Node.DOCUMENT_NODE:
    case Node.DOCUMENT_FRAGMENT_NODE:
    stepIn(node);
    break;
    case Node.ELEMENT_NODE:
    switch (guessCircleCiNodeType(node)) {
    case WORKFLOWS_STATUS:
    case JOBS_STATUS:
      handleStatusIcon(node);
    }
    stepIn(node);
    break;
    case Node.TEXT_NODE:
    handleText(node);
    break;
  }
}

function getStatusFromNode(node) {
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
};

function replaceIcon(node, status) {
  // switch(status) {
  // case "failed":
  //   node.innerHTML = "FAIL ICON";
  //   break;
  // case "success":
  //   node.innerHTML = "SUCCESS ICON"
  //   break;
  // }
  return;
}

function handleStatusIcon(node) {
  var status = getStatusFromNode(node);
  if (status) {
    replaceIcon(node, status);
  }
}

function handleText(textNode)
{
  var v = textNode.nodeValue;

  v = v.replace(/\bbranches\b/ig, currentSettings.branches);
  v = v.replace(/\bfailed\b/ig, currentSettings.failed);
  v = v.replace(/\bsuccess\b/ig, currentSettings.success);
  v = v.replace(/\bsucceeded\b/ig, currentSettings.succeeded);

  textNode.nodeValue = v;
}

document.addEventListener("DOMNodeInserted", throttle(
  function() {
    readDataFromStorage(function(data) {
      currentSettings = data;
      walkPage();
    });
  },
  750
), false);
