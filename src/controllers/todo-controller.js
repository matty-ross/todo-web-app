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
            $(todoTemplate.find('td')[1]).text(todo.title);
            $(todoTemplate.find('td')[2]).text(todo.dueDate);

            $(this.todosTarget).append(todoTemplate);
        });
    }

    // ----

    add() {
        $(this.formTarget).find('#title').val('');
        $(this.formTarget).find('#description').val('');
        $(this.formTarget).find('#due-date').val('');
        
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

    edit() {
    }

    delete() {
    }

    confirm() {
        this.confirmCallback();
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
