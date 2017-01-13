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
            return filters[this.visibility](this.todos);
        },
        remaining: function() {
            return filters.active(this.todos).length;
        }
    },
    watch: {
        todos: {
            handler: function(todos) {
                todoStorage.save(todos);
            },
            deep: true
        }
    },
    methods: {
        addTodo: function() {
            var value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return;
            }
            this.todos.push({
                title: value,
                completed: false
            })
            this.newTodo = ''
        },
        removeTodo: function(todo) {
            this.todos.$remove(todo);
        }
    }
})



var router = new Router();

['all', 'active', 'completed'].forEach(function(visibility) {
    router.on(visibility, function() {
        app.visibility = visibility;
    });
});

router.configure({
    notfound: function() {
        window.location.hash = '';
        app.visibility = 'all';
    }
});

router.init();
