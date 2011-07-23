# Error logging
E =
  (typeof console?.error == 'function') and ((msg)-> console.error msg) or ->

# When running in require.js optimizer, window & document do not exist
window = this
document = window.document or {createElement:->}

# is-Node check for all browsers
isNode =
  if typeof Node is 'object'
    (o)-> o instanceof Node
  else
    (o)-> typeof o is 'object' and typeof o.nodeType is 'number' and typeof o.nodeName is 'string'

# is-HTMLElement check for all browsers
isElement =
  if typeof HTMLElement == "object" then (o)-> o instanceof HTMLElement
  # For Mr. IE8-can't-handle-DOM2
  else
    (o)-> typeof o == "object" and o.nodeType == 1 and typeof o.nodeName == "string"

# ES5 Function.bind
bind = do->
  slice = Array.prototype.slice
  if fbind = Function.prototype.bind
    (func,obj)-> fbind.apply func, [obj].concat slice.call arguments, 2
  else
    (func,obj)->
      args = slice.call arguments, 2
      -> func.apply obj, args.concat(slice.call(arguments))

# Copies properties from src obj to dest obj
extendObj = (destObj, srcObj)->
  destObj[p] = srcObj[p] for p of srcObj
  destObj

# Generates unique identifiers, given a prefix
uniqueId = do->
  postfix = 0
  (prefix)-> prefix+(postfix++)

# Setup up prototypical inheritance (inspired by goog.inherits and Backbone.js inherits() implementations)
inherits = do->
  ctor = ->
  (parent, protoProps)->
    child =
      if protoProps and protoProps.hasOwnProperty 'constructor' then protoProps.constructor
      else -> return parent.apply this, arguments
    extendObj child, parent
    ctor.prototype = parent.prototype
    child.prototype = new ctor()
    extendObj child.prototype, protoProps
    child::constructor = child
    child.__super__ = parent.prototype
    child

window.cell ?= cell = do->
  tmpNode = document.createElement 'div'
  optsToProps = ['id','class','model','collection']

  (@options = {})->
    @_renderNodes = (nodes)=>
      renderChildren @el, nodes
      @_isRendering = false
      @__delegateEvents()
      @$el.trigger 'afterRender'
      @_isReady = true
      if @_readys
        for r in @_readys
          try r this
        delete @_readys
      return

    # Copy over class and id properties for convenience
    for p in optsToProps when (val = @options[p])
      @[p] = val

    # Create DOM node
    tmpNode.innerHTML = @__renderOuterHTML
    @el = tmpNode.children[0]
    @$el = $(@el)

    # Add the cell's class
    className = ""
    for n in [@cell::name,@el.className,@class] when n
      className += ' '+n
    if className != ""

      @el.className = className

    (typeof @id == 'string') and @el.id = @id

    @update()
    return

renderHelper = (a,b,children...)->
  if a and (l = arguments.length) > 0
    if l > 1 and b?.constructor isnt Object
      children.unshift b
      b = undefined

    if parent = renderParent a,b
      renderChildren parent, children
      return parent

selRegex = /^([A-z]+)?(#[A-z0-9\-]+)?(\.[A-z0-9\.\-]+)?$/
renderParent = (a,b)->
  if typeof a is 'string' and (m = selRegex.exec a) and m[0]
    parent = document.createElement m[1] or 'div'
    if m[2]
      parent.id = m[2].slice 1
    if m[3]
      parent.className = m[3].replace /\./g, ' '

    for k,v of b
      parent[k] = v

    parent
  
  else if a.prototype?.cell == a
    (new a b).el

  else if isElement a
    a

  else
    E 'renderParent: unsupported parent type = '+a

renderChildren = (parent,children)->
  while children.length > 0 when (c = children.shift())?
    if c instanceof Array
      Array::unshift.apply children, c
    else if (type = typeof c) in ['string','number']
      parent.appendChild document.createTextNode c
    else if isNode c
      parent.appendChild c
    else if not (c in [undefined,null] or type is 'boolean')
      E 'renderChild: unsupported child type = '+c

cell.extend = do->
  renderFuncNameRegex = /render([ ]+<(\w+)([ ]+.*)*>[ ]*)?$/
  eventsNameRegex = /bind( (.+))?/
  eventSelRegex = /^(\w+)(\s(.*))?$/

  (protoProps, name)->
    protoProps.__eventBindings = @::__eventBindings?.slice(0) or []

    # Find and process Event Bindings and Render Function specified in
    # the cell's definition
    for propName,prop of protoProps

      # Parse Event Bindings
      # Syntax: bind [property name]?
      #   [property name] name of property to observe
      #     If not specified, 'el' (view) is used.
      if (match = eventsNameRegex.exec propName) and typeof prop == 'object'
        bindProp = match[2] ? 'el'
        binds = []

        # Parse each Event Binding
        # Syntax: [event name] [CSS selector]?
        #   [event name]    Event to observe
        #   [CSS selector]  If property being observed is an HTMLElement,
        #     the CSS selector will be used to only target selected nodes.
        for desc,handler of prop when (selmatch = eventSelRegex.exec desc)
          binds.push
            name: selmatch[1]
            sel: selmatch[3]
            handler: handler

        if binds.length
          protoProps.__eventBindings.push prop: bindProp, binds: binds
          
      # Find and add render function (if not already found)
      else if not protoProps.__renderTagName and match = renderFuncNameRegex.exec propName
        if typeof (protoProps.__render=prop) != 'function'
          E "cell.extend expects '#{propName}' to be a function"
          return
        tag = protoProps.__renderTagName = match[2] != "" and match[2] or 'div'
        protoProps.__renderOuterHTML = "<#{tag}#{match[3] ? ""}></#{tag}>"

    if typeof name == 'string'
      protoProps.name = name
    child = inherits this, protoProps

    # Must find a render function 
    if not (p = child.prototype).__renderTagName
      E 'cell.extend([constructor:Function],prototypeMembers:Object): could not find a render function in prototypeMembers'
    else
      child.extend = cell.extend
      p.cell = child

      # Render CSS in <style>
      if typeof (css = protoProps.css) == 'string'
        el = document.createElement 'style'
        el.innerHTML = css

      # Attach CSS <link>
      else if typeof (cssref = protoProps.css_href) == 'string'
        el = document.createElement 'link'
        el.href = cssref
        el.rel = 'stylesheet'

      if el
        el.type = 'text/css'
        $('head')[0].appendChild el
        
      child

cell.prototype =
  $: (selector)-> $ selector, @el

  ready: (f)->
    if @_isReady then try f this
    else
      (@_readys ?= []).push f

  update: ->
    @_isReady = false
    @init? @options
    @_isRendering = true
    if (nodes = @__render renderHelper, @_renderNodes) instanceof Array
      @_renderNodes nodes
    return

  __delegateEvents: ->
    # Unbind any previous event bindings
    if @_unbinds
      for ub in @_unbinds then try ub()
      delete @_unbinds
    @_unbinds = []
    for {prop,binds} in @__eventBindings when isElement(obj = @[prop])
      obj = @$(obj)
      for {name,sel,handler} in binds then do(obj,name,sel,handler)=>
        if typeof handler is 'string'
          handler = @[handler]

        if typeof handler is 'function'
          handler = bind handler, this
          @_unbinds.push(
            if sel
              obj.delegate sel, name, handler
              ->
                obj.undelegate sel, name, handler
                return
            else
              obj.bind name, handler
              ->
                obj.unbind name, handler
                return
          )
        return
    return

# cell AMD Module
if typeof define == 'function' and typeof require == 'function'
  define 'cell', [], exports =
    pluginBuilder: 'cell-pluginBuilder'

    load: do->
      moduleNameRegex = /(.*\/)?(.*)/
      relUrlRegex = /^(\.+\/)/
      midRelUrlRegex = /(\/\.\/)/g
      (name, req, load, config)->
        req [name], (CDef)->
          if typeof CDef != 'object'
            E "Couldn't load #{name} cell. cell definitions should be objects, but instead was #{typeof CDef}"
          else
            [baseUrl,cellName] = moduleNameRegex.exec(name)[1..]

            # Helper function for renderHelper.cell.
            # Properly normalize dep url
            CDef._require = (dep,cb)->
              req ["cell!#{relUrlRegex.test(dep) and baseUrl or ''}#{dep}".replace midRelUrlRegex, '/'], cb

            if typeof exports.__preinstalledCells__?[name] == 'undefined'
              CDef.css_href ?= req.toUrl "#{name}.css"

            if typeof CDef.extends == 'string'
              req ["cell!#{CDef.extends}"], (parentCell)->
                if parentCell::name
                  CDef.class = parentCell::name + " #{CDef.class}" or ""
                load parentCell.extend CDef, cellName
                return
            else
              load cell.extend CDef, cellName
          return
        return

  require ['cell'], (cell)->
    # Load/render cells specified in DOM node data-cell attributes
    require.ready ->
      $('[data-cell]').each ->
        node = this
        if cellname=node.getAttribute('data-cell')
          opts = {}
          cachebust = /(^\?cachebust)|(&cachebust)/.test window.location.search
          if ((cachebustAttr = node.getAttribute('data-cell-cachebust')) != null or cachebust) and cachebustAttr != 'false'
            opts.urlArgs = "bust=#{new Date().getTime()}"
          if baseurl = node.getAttribute 'data-cell-baseurl'
            opts.baseUrl = baseurl
          require opts, ["cell!#{cellname}"], (CType)->
            $(node).append(new CType().el)
            return
        return
      return
    return
