import { Application } from './vendor/stimulus.js';

const application = Application.start();

import TodoController from './controllers/todo-controller.js';
application.register('todo', TodoController);