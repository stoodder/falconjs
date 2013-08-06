// Setup mock data storages. This is only being used for example purposes 
// to demonstrate how one would got about loading up templates and server 
// data from a remote source using ajax calls. For parts of this example, 
// we're using sinon.js to intercept and respond to ajax requests and we're
// using the javascript storage objects below simply as our 'mock' server data.

// Template Data Storage, These are the same templates from the previous 
// example except stored remotely
var TEMPLATES = {
  "todo_list.tmpl": "" +
      "<!-- ko with: todo_list -->" +
          "<h3>" +
              "<!-- ko text: title --><!-- /ko -->" +
              "<a data-bind=\"click: $view.editTodoList\">Edit</a>" +
              "<a data-bind=\"click: $view.deleteTodoList\">Delete</a>" +
          "</h3>" +
          "<p data-bind=\"text: description\"></p>" +
          "<ul class=\"todo-list\" data-bind=\"foreach: todos\">" +
              "<li data-bind=\"css: {'completed': is_complete}\">" +
                  "<!-- ko text: text --><!-- /ko -->" +
                  "<a data-bind=\"click: $view.completeTodo\">[Complete]</a>" +
                  "<a data-bind=\"click: $view.removeTodo\">[X]</a>" +
              "</li>" +
          "</ul>" +
          "<input type=\"text\" data-bind=\"value: $view.new_todo_text\" />" +
          "<button data-bind=\"click: $view.addTodo\">Add</button>" +
      "<!-- /ko -->",

  "edit_todo_list.tmpl": "" +
      "<form class=\"form-horizontal\" data-bind=\"submit: $view.saveTodoList\">" +
          "<div class=\"control-group\">" +
              "<label class=\"control-label\">Title</label>" +
              "<div class=\"controls\">" +
                  "<input type=\"text\" class=\"input-large\" data-bind=\"value: $view.title\" />" +
              "</div>" +
          "</div>" +
          "<div class=\"control-group\">" +
              "<label class=\"control-label\">Description</label>" +
              "<div class=\"controls\">" +
                  "<textarea data-bind=\"value: $view.description\"></textarea>" +
              "</div>" +
          "</div>" +
          "<div class=\"form-actions\">" +
              "<input type=\"button\" class=\"btn\" value=\"Cancel\" data-bind=\"click: $view.cancelSave\" />" +
              "<input type=\"submit\" class=\"btn btn-primary\" value=\"Save\" />" +
          "</div>" +
      "</form>",

  "layout.tmpl": "" +
      "<div id=\"layout-sidebar\">" +
          "<button data-bind=\"click: $view.newTodoList\">New Todo List</button>" +
          "<ul id=\"todolist-list\" data-bind=\"foreach: $view.todo_lists\">" +
              "<li data-bind=\"click: $view.selectTodoList, css: {'selected': $view.isSelectedList( $data )}\">" +
                  "<strong data-bind=\"text: title\"></strong>" +
                  "<p data-bind=\"text: description\"></p>" +
              "</li>" +
          "</ul>" +
          "</div>" +
      "<div id=\"content-view\">" +
          "<!-- ko ifnot: $view.current_view -->" +
              "<div class=\"alert alert-info\">" +
                  "<h4>No List Selected</h4>" +
                  "<p>Start by selecting a todo list from the menu on the left.</p>" +
              "</div>" +
          "<!-- /ko -->" +
          "<!-- ko if: $view.current_view -->" +
              "<!-- ko view: $view.current_view --><!-- /ko -->" +
          "<!-- /ko -->" +
      "</div>"
};

//todo
//todo_list
var _ajax  = $.ajax;
var todo_lists = [];
var todo_list_id_index = 1;
var todo_id_index = 1;

try {
    todo_lists = JSON.parse( window.localStorage.getItem("__FALCON_EXAMPLE_DATA__") || "[]" );
} catch(e) {}

todo_list_id_index = todo_lists.length + 1;
for( var index in todo_lists ) {
    var todo_list = todo_lists[index];
    todo_id_index += todo_list.todos.length;
}

//Ajax override and mock data response
var json_override = function(options, data, status)
{
    status = status || 200;
    options.type = "POST";
    options.url = "/echo/json/";
    options.data = {'json': JSON.stringify(data)};
    return options;
}

var html_override = function(options, html, status)
{
    status = status || 200;
    options.type = "POST";
    options.url = "/echo/html/";
    options.data = {'html': html};
    return options;
}

//Override jQuery's ajax method to utilize local memory mocking
$.ajax = function(options)
{
    var url = options.url,
        method = ( options.type || "get" ).toLowerCase(),
        matches = null;
    
    try {
        options.data = JSON.parse( options.data );
    } catch(e){}
    
    if( url.match(/\/api\/todo_list\.json/) ) {
        
        if(method === "get") {
            json_override( options, todo_lists );
            
        } else if( method === "post" ) {
            options.data['id'] = todo_list_id_index++;
            todo_lists.push( options.data );
            json_override( options, options.data );
        }
    } else if( matches = url.match(/\/api\/todo_list\/(\d+)\.json/) ) {
        var todo_list_id = parseInt( matches[1] );
        var todo_list = _.find( todo_lists, function(todo_list) {
            return todo_list.id === todo_list_id;
        });
        
        if( todo_list === null ) {
            //Don't do anything, this should respond with 404
            return _ajax.call(this, options);
        }
        
        if( method === "get" ) {
            json_override( options, todo_list );
            
        } else if( method === "put" ) {
            _.extend(todo_list, options.data);
            json_override( options, todo_list );
            
        } else if( method === "delete" ) {
            todo_lists = _.without( todo_lists, todo_list );
            json_override( options, todo_list );
        }
    } else if( matches = url.match(/\/api\/todo_list\/(\d+)\/todo\.json/) ) {
        var todo_list_id = parseInt( matches[1] );
        var todo_list = _.find( todo_lists, function(todo_list) {
            return todo_list.id === todo_list_id;
        });
        
        if( todo_list === null ) {
            //Don't do anything, this should respond with 404
            return _ajax.call(this, options);
        }
        
        if( method === "get" ) {
            json_override( options, todo_list.todos );
            
        } else if( method === "post" ) {
            options.data.id = todo_id_index++;
            todo_list.todos = todo_list.todos || [];
            todo_list.todos.push( options.data );
            json_override( options, options.data );
        }
    } else if( matches = url.match(/\/api\/todo_list\/(\d+)\/todo\/(\d+)\.json/) ) {
        var todo_list_id = parseInt( matches[1] );
        var todo_list = _.find( todo_lists, function(todo_list) {
            return todo_list.id === todo_list_id;
        });
        
        if( todo_list === null ) {
            //Don't do anything, this should respond with 404
            return _ajax.call(this, options);
        }
        
        var todo_id = parseInt( matches[2] );
        var todo = _.find( todo_list.todos, function(todo) {
            return todo.id === todo_id;
        });
        
        if( todo === null ) {
            //Don't do anything, this should respond with 404
            return _ajax.call(this, options);
        }
        
        if( method === "get" ) {
            json_override( options, todo );
        } else if( method === "put" ) {
            _.extend( todo, options.data );
            json_override( options, todo );
        } else if( method === "delete" ) {
            todo_list.todos = _.without( todo_list.todos, todo );
            json_override( options, todo );
        }
    } else if( matches = url.match(/\/template\/([a-z_]+\.tmpl)/) ) {
        var template = TEMPLATES[matches[1]];
        
        if( template !== null )
        {
            html_override( options, template );
        }
    }
    
    window.localStorage.setItem("__FALCON_EXAMPLE_DATA__", JSON.stringify(todo_lists));
    
    return _ajax.call(this, options);
};