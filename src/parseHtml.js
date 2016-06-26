// Debug this here:
// https://jsbin.com/quvazeh/2/edit?html,js,output

function titleDepth(elem) {
  if ($(elem).is("h1")) {
    return 1;
  }
  if ($(elem).is("h2")) {
    return 2;
  }
  if ($(elem).is("h3")) {
    return 3;
  }
  if ($(elem).is("h4")) {
    return 4;
  }
  if ($(elem).is("h5")) {
    return 5;
  }
  if ($(elem).is("h6")) {
    return 6;
  }
  return -1;
}

function isDeeper(a, b) {
  if ($(a).is("p")) {
    return false; // p is never deeper than anything
  }
  if ($(b).is("p")) {
    return false; // Nothing is deeper than p
  }
  return titleDepth(a) > titleDepth(b);
}

function addChild(place, child) {
  if (!place.children) {
    place.children = [];
  }
  place.children.push(child);
}

function assert(x) {
  if (!x) {
    console.log("Assertion failed");
    throw new Exception("Assertion failed");
  }
}

function parseHtml(rawHtml) {
  var result = {title: "Parsed HTML", children:[]};
    
  var stack = [];
  
  $(rawHtml).find("p,h1,h2,h3,h4,h5,h6").each( function() {
    var element = {title: $(this).text()};
    var depth = titleDepth(this);
    
    if (depth === -1) {      
      // Not a title, just push it
      var parent = stack.length > 0 ? stack[stack.length-1].element : result;
      addChild(parent, element);
      return;
    } 
    
    // Find parent
    var lastItem;
    while (stack.length > 0 && depth <= stack[stack.length - 1].depth) {
      lastItem = stack.pop();
      if (depth === lastItem.depth) {
        // sibling
        addChild(lastItem.parent, element);
        stack.push({parent:lastItem.parent, element: element, depth:depth});
        return;
      }
    }
    if (stack.length === 0) {
      // Top level
      addChild(result, element);
      stack.push({parent: result, element: element, depth: depth});
      return;
    }
    
    assert(depth > stack[stack.length - 1].depth);
    lastItem = stack[stack.length - 1];
    addChild(lastItem.element, element);
    stack.push({parent: lastItem.element, element: element, depth: depth});
  });
  
  return result;
}



// Debugging
///////////////
function indent(str, depth) {
  var spaces = '';
  for (var i = 0; i < depth; ++i) {
    spaces += '*';
  }
  return spaces + str;
}

function treetoText(result, depth) {
  var text = '';
  if (!depth) {
    depth = 0;
  }
  
  if (result.title) {
    text += indent(result.title + '<br/>', depth);
  }
  if (result.children) {
    $.each(result.children, function(index, value) {
      text += treetoText(value, depth+1);
    });
  }
  return text;
}
