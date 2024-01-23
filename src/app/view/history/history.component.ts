
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { IPagination } from 'src/app/components/pagination/IPagination';
import { TaskFilters } from 'src/app/models/filters/task-filter';
import { Pagination } from 'src/app/models/pagination';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy, IPagination {
  private readonly DEBOUCE_TIME = 300

  taskPagination: Pagination<Task>
  subscription: Subscription
  fieldsSearch: FormControl = new FormControl('')

  filters: TaskFilters = { size: 2 };

  filters$ = this.fieldsSearch.valueChanges.pipe(
    debounceTime(this.DEBOUCE_TIME),
  )

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (!this.fieldsSearch.value) {
      this.taskService.list(this.filters)
    }

    this.filters$.subscribe(input => {
      this.filters.page = 0
      this.filters.task_like = input
      this.taskService.list(this.filters)
    })

    this.subscription = this.taskService.taskPagination$.subscribe(taskPagination => {
      this.taskPagination = taskPagination
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  nextPage = (): void => {
    this.filters.page = this.taskPagination.pageable.pageNumber + 1
    this.taskService.list(this.filters)
  }

  previousPage = (): void => {
    this.filters.page = this.taskPagination.pageable.pageNumber - 1
    this.taskService.list(this.filters)
  }

  changePageTo(to: number) {
    this.filters.page = to
    this.taskService.list(this.filters)
  }
}
