import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, filter, map } from 'rxjs';
import { TaskFilters } from 'src/app/models/filters/task-filter';
import { TaskPagination } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  private readonly DEBOUCE_TIME = 300

  taskPagination: TaskPagination
  subscription: Subscription
  fieldsSearch: FormControl = new FormControl('')

  numbersPage = []
  filters: TaskFilters = { _limit: 2 };

  filters$ = this.fieldsSearch.valueChanges.pipe(
    debounceTime(this.DEBOUCE_TIME),
  )

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (!this.fieldsSearch.value) {
      this.taskService.list(this.filters)
    }

    this.filters$.subscribe(input => {
      this.filters.task_like = input
      this.taskService.list(this.filters)
    })

    this.subscription = this.taskService.taskPagination$.subscribe(taskPagination => {
      this.taskPagination = taskPagination
      this.numbersPage = Array(taskPagination.totalPages).fill(0).map((x, i) => i + 1)
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  nextPage() {
    this.filters._page = this.taskPagination.pageable.pageNumber + 1
    this.taskService.list(this.filters)
  }

  previousPage() {
    this.filters._page = this.taskPagination.pageable.pageNumber - 1
    this.taskService.list(this.filters)
  }

  changePageTo(to: number) {
    this.filters._page = to
    this.taskService.list(this.filters)
  }

  currentPage() {
    return this.taskPagination.pageable.pageNumber
  }
}
