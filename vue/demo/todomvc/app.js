var STORAGE_KEY = 'todos-vuejs';

window.todoStorage = {
    fetch: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
};


var filters = {
    all: function(todos) {
        return todos;
    },
    active: function(todos) {
        return todos.filter(function(todo) {
            return !todo.completed;
        });
    },
    completed: function(todos) {
        return todos.filter(function(todo) {
            return todo.completed;
        });
    }
};


var app = new Vue({
    el: '.todoapp',
    data: {
        newTodo: '',
        todos: todoStorage.fetch(),
        visibility: 'all'
    },
    computed: {
        filteredTodos: function() {
        	console.log(this)
            return filters[this.visibility](this.todos);
        }
    }
})
