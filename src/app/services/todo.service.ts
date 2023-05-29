import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Filter } from '../models/filtering.model';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: Todo[];
  private filteredTodos: Todo[];
  private currentFilter: Filter = Filter.All;

  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<
    Todo[]
  >([]);

  todo$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) {}

  clearCompleted() {
    this.todos = this.todos.filter((task) => !task.isComplete);
    this.updateToLocalStorage();
  }

  deleteTodo(id: number) {
    const index = this.todos.findIndex((x) => x.id === id);
    this.todos.splice(index, 1);
    this.updateToLocalStorage();
  }

  changeTodoContent(taskChange: Todo) {
    const index = this.todos.findIndex((x) => x.id === taskChange.id);
    this.todos[index].content = taskChange.content;
    this.updateToLocalStorage();
  }

  changeTodoStatus(id: number) {
    const index = this.todos.findIndex((x) => x.id === id);
    this.todos[index].isComplete = !this.todos[index].isComplete;
    this.updateToLocalStorage();
  }

  addTodo(content: string) {
    let newTodo = new Todo(Date.now(), content, false);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  fetchFromLocalStorage() {
    this.todos = this.storageService.getValue<Todo[]>('todos') || [];
    this.filteredTodos = [...this.todos];
    this.updateData();
  }

  updateToLocalStorage() {
    this.storageService.setObject('todos', this.todos);
    this.filterTodos(Filter.All);
    this.updateData();
  }

  filterTodos(filter: Filter) {
    this.currentFilter = filter;
    switch (filter) {
      case Filter.Complete:
        this.filteredTodos = this.todos.filter((task) => task.isComplete);
        break;
      case Filter.Active:
        this.filteredTodos = this.todos.filter((task) => !task.isComplete);
        break;
      case Filter.All:
        this.filteredTodos = [...this.todos];
        break;
    }
    this.updateData();
  }

  private updateData() {
    this.lengthSubject.next(this.todos.length);
    this.displayTodosSubject.next(this.filteredTodos);
  }
}
