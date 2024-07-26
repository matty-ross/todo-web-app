import { Application } from './stimulus.js';

import TodoController from './controllers/todo-controller.js';

window.Stimulus = Application.start();
Stimulus.register('todo', TodoController);
