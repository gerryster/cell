define

  nodeHTMLEquals: nodeHTMLEquals = (node, expectedHTML)->
    ok node instanceof HTMLElement, "expected HTMLElement"
    strictEqual nodeToHTML(node), expectedHTML, "expected #{expectedHTML}"

  nodeToHTML: nodeToHTML = (node)->

    if node.tagName
      html = "<#{node.tagName.toLowerCase()}"

      if node.attributes.length > 0
        list = (attr for attr in node.attributes)
        list.sort (a,b)->
          if a.name is b.name then 0
          else if a.name < b.name then -1
          else 1
        for {name,value} in list
          html += " #{name}=\"#{value}\""

      html += ">"
          
      for child in $(node).contents()
        html += nodeToHTML child
        
      html += "</#{node.tagName.toLowerCase()}>"

    else
      $(node).text()
