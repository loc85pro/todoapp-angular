import { Component, OnInit } from '@angular/core';
import { FilterButton, Filter } from 'src/app/models/filtering.model';
import { TodoService } from 'src/app/services/todo.service';
import { Observable, filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  filterButton: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Active', isActive: false },
    { type: Filter.Complete, label: 'Complete', isActive: false },
  ];

  length$: Observable<number>;
  constructor(private todoService: TodoService) {}

  changeFilter(button: FilterButton) {
    this.filterButton = this.filterButton.map((x) =>
      x.type == button.type
        ? { ...x, isActive: true }
        : { ...x, isActive: false }
    );

    this.todoService.filterTodos(button.type);
  }

  clearCompleted() {
    this.todoService.clearCompleted();
  }
  ngOnInit(): void {
    this.length$ = this.todoService.length$;
  }
}
