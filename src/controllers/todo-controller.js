import { Controller } from '../stimulus.js';


export default class extends Controller {
    static targets = [
        'modal',
        'form',
        'todos',
        'todoTemplate',
    ];

    static values = {
        todos: Array,
        action: String,
    }

    // ----

    initialize() {
        // this.todosValue = JSON.parse(localStorage.getItem('todos') ?? '[]');
    }

    todosValueChanged() {
        // localStorage.setItem('todos', this.todosValue);

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
        this.actionValue = 'add';
        this.#openModal('Add');
    }

    edit() {
        this.actionValue = 'edit';
        this.#openModal('Edit');
    }

    delete() {

    }

    confirm() {
        switch (this.actionValue) {
            case 'add': {
                this.#onAddConfirmed();
                this.#closeModal();
                break;
            }
        }
    }

    // ----

    #onAddConfirmed() {
        const todo = this.#readForm();

        const todos = this.todosValue;
        todos.push(todo);
        this.todosValue = todos;
    }

    // ----

    #openModal(action) {
        this.#clearForm();

        $(this.modalTarget).find('.modal-title').text(`${action} TO-DO`);
        new bootstrap.Modal(this.modalTarget).show();
    }

    #closeModal() {
        new bootstrap.Modal(this.modalTarget).hide();
    }

    #readForm() {
        return {
            title: $(this.formTarget).find('#title').val(),
            description: $(this.formTarget).find('#description').val(),
            dueDate: $(this.formTarget).find('#due-date').val(),
        };
    }

    #clearForm() {
        $(this.formTarget).find('#title').val('');
        $(this.formTarget).find('#description').val('');
        $(this.formTarget).find('#due-date').val('');
    }
}
