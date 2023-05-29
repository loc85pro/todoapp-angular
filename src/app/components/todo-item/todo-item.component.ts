import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent {
  @Input() task: Todo;
  @Output() changeStatus: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() changeContent: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() deleteTodo: EventEmitter<Todo> = new EventEmitter<Todo>();
  isHovered: boolean = false;
  isEditing: boolean = false;

  constructor() {}

  changeTodoStatus() {
    this.changeStatus.emit({ ...this.task, isComplete: !this.task.isComplete });
  }

  changeContentTodo() {
    this.changeContent.emit(this.task);
    this.isEditing = false;
  }

  delete() {
    this.deleteTodo.emit(this.task);
  }
}
