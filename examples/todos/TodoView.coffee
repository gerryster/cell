# The TodoView listens for changes to its model, re-rendering. Since there's
# a one-to-one correspondence between a **Todo** and a **TodoView** in this
# app, we set a direct reference on the model for convenience.
window.TodoView = Cell.extend
   
   'render <li>': ->
      """
      <div class="todo #{ @model.get('done') and 'done' or '' }">
        <div class="display">
          <input class="check" type="checkbox" #{ @model.get('done') and 'checked="checked"' or '' } />
          <div class="todo-content">#{@model.get 'content'}</div>
          <span class="todo-destroy"></span>
        </div>
        <div class="edit">
          <input class="todo-input" type="text" value="#{@model.get 'content'}" />
        </div>
      </div>
      """

   # The DOM events specific to an item.
   'events el':
      "click .check" : -> @model.toggle()

      # Switch this view into `"editing"` mode, displaying the input field.
      "dblclick div.todo-content" : ->
         $(@el).addClass "editing"
         @$('.todo-input').focus()

      # Remove the item, destroy the model.
      "click span.todo-destroy" : -> @model.clear()

      # If you hit `enter`, we're through editing the item.
      "keypress .todo-input" : (e)->
         if e.keyCode == 13
            close.call this

      # Close the "editing" mode, saving changes to the todo.
      "blur .todo-input" : close = ->
         @model.save content: @$('.todo-input').val()
         $(@el).removeClass 'editing'

   'events model':
      'change': 'update'
       # Remove this view from the DOM.
      'removed': -> $(@el).remove()