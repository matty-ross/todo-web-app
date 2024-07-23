import { Controller } from '../stimulus.js';


export default class extends Controller {
    static targets = [
        'modal',
        'form',
        'todos',
        'todoTemplate',
    ]

    static values = {
        todos: Array,
    }

    modal = null;
    confirmCallback = null;

    // ----

    initialize() {
        this.todosValue = JSON.parse(localStorage.getItem('todos') ?? '[]');
        this.modal = new bootstrap.Modal(this.modalTarget);
    }

    todosValueChanged() {
        localStorage.setItem('todos', JSON.stringify(this.todosValue));

        $(this.todosTarget).empty();
        
        this.todosValue.forEach((todo, index) => {
            const todoTemplate = $($(this.todoTemplateTarget).html());
            todoTemplate.data('index', index);
            $(todoTemplate.find('td')[1]).text(todo.title);
            $(todoTemplate.find('td')[2]).text(todo.dueDate);

            $(this.todosTarget).append(todoTemplate);
        });
    }

    // ----

    add() {
        this.#clearForm();
        
        $(this.modalTarget).find('.modal-title').text("Add TO-DO");
        
        this.modal.show();

        this.confirmCallback = () => {
            const todo = this.#readForm();

            const todos = this.todosValue;
            todos.push(todo);
            this.todosValue = todos;

            this.modal.hide();
        };
    }

    edit(e) {
        const index = $(e.currentTarget).parents('tr').data('index');
        const todo = this.todosValue[index];

        this.#writeForm(todo);

        $(this.modalTarget).find('.modal-title').text("Edit TO-DO");
        
        this.modal.show();

        this.confirmCallback = () => {
            const todo = this.#readForm();

            const todos = this.todosValue;
            todos[index] = todo;
            this.todosValue = todos;

            this.modal.hide();
        };
    }

    delete(e) {
        const index = $(e.currentTarget).parents('tr').data('index');
        const todo = this.todosValue[index];

        this.confirmCallback = null;

        Swal.fire({
            title: "Delete TO-DO",
            text: `Are you sure to delete '${todo.title}' TO-DO?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then(result => {
            if (result.isConfirmed) {
                const todos = this.todosValue;
                todos.splice(index, 1);
                this.todosValue = todos;
            }
        });
    }

    confirm() {
        if (this.confirmCallback) {
            this.confirmCallback();
        }
    }

    // ----

    #readForm() {
        return {
            title: $(this.formTarget).find('#title').val(),
            description: $(this.formTarget).find('#description').val(),
            dueDate: $(this.formTarget).find('#due-date').val(),
        };
    }

    #writeForm(todo) {
        $(this.formTarget).find('#title').val(todo.title);
        $(this.formTarget).find('#description').val(todo.description);
        $(this.formTarget).find('#due-date').val(todo.dueDate);
    }

    #clearForm() {
        $(this.formTarget).find('#title').val('');
        $(this.formTarget).find('#description').val('');
        $(this.formTarget).find('#due-date').val('');
    }
}
