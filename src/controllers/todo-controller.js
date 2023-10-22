import { Controller } from '/vendor/stimulus.js';


class Todo {
    title = null;
    description = null;
    dueDate = null;

    get title() {
        return this.title;
    }

    set title(title) {
        this.title = title;
        return this;
    }

    get description() {
        return this.description;
    }

    set description(description) {
        this.description = description;
        return this;
    }

    get dueDate() {
        return this.dueDate;
    }

    set dueDate(dueDate) {
        this.dueDate = dueDate;
        return this;
    }
}


export default class extends Controller {
    static targets = [
        'modal',
        'confirmBtn',
    ];

    static values = {
        todos: Array,
    }
    
    todoModal = null;
    actionCallback = null;

    initialize() {
        this.todoModal = new bootstrap.Modal(this.modalTarget);
        this.todosValue = JSON.parse(localStorage.getItem('todos') ?? '[]');
        
        $(this.confirmBtnTarget).on('click', (e) => {
            e.preventDefault();
            this.actionCallback();
        });
    }

    todosValueChanged() {
        $('#todo-table tbody').empty();
        this.todosValue.forEach((todo, i) => {
            const row = $('#todo-table-row').contents('tr').clone();
            row.find('.todo-title').text(todo.title);
            row.find('.todo-due-date').text(todo.dueDate);
            row.data('index', i);

            $('#todo-table tbody').append(row);
        });

        localStorage.setItem('todos', JSON.stringify(this.todosValue));
    }

    add(e) {
        this.clearForm();
        
        $(this.modalTarget).find('.modal-title').text('Add TO-DO');
        this.todoModal.show();

        this.actionCallback = () => {
            const todo = this.readForm();
            
            const tmp = [...this.todosValue];
            tmp.push(todo);
            this.todosValue = tmp;
            
            this.todoModal.hide();
        };
    }

    detail(e) {
        this.clearForm();

        const index = $(e.currentTarget).closest('tr').data('index');
        const todo = this.todosValue[index];
        this.writeForm(todo, true);

        $(this.modalTarget).find('.modal-title').text('TO-DO');
        this.todoModal.show();

        this.actionCallback = () => {};
    }

    edit(e) {
        this.clearForm();

        const index = $(e.currentTarget).closest('tr').data('index');
        const todo = this.todosValue[index];
        this.writeForm(todo, false);

        $(this.modalTarget).find('.modal-title').text('Edit TO-DO');
        this.todoModal.show();

        this.actionCallback = () => {
            const todo = this.readForm();
            
            const tmp = [...this.todosValue];
            tmp[index] = todo;
            this.todosValue = tmp;
            
            this.todoModal.hide();
        };
    }

    delete(e) {
        const index = $(e.currentTarget).closest('tr').data('index');

        Swal.fire({
            title: 'Delete TO-DO',
            text: 'Are you sure you want to delete this TO-DO?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const tmp = [...this.todosValue];
                tmp.splice(index, 1);
                this.todosValue = tmp;
            }
        });
    }

    readForm() {
        const todo = new Todo();
        todo.title = $('#todo-title').val();
        todo.description = $('#todo-description').val();
        todo.dueDate = $('#todo-due-date').val();
        return todo;
    }

    writeForm(todo, readonly) {
        $('#todo-title').val(todo.title).prop('readonly', readonly);
        $('#todo-description').val(todo.description).prop('readonly', readonly);
        $('#todo-due-date').val(todo.dueDate).prop('readonly', readonly);
    }

    clearForm() {
        $('#todo-title').val(null).prop('readonly', false);
        $('#todo-description').val(null).prop('readonly', false);
        $('#todo-due-date').val(null).prop('readonly', false);
    }
}