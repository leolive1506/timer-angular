import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, filter, map } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  private readonly DEBOUCE_TIME = 300
  tasks: Task[] = []
  subscription: Subscription
  fieldsSearch: FormControl = new FormControl('')

  filters$ = this.fieldsSearch.valueChanges.pipe(
    debounceTime(this.DEBOUCE_TIME),
  )

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (!this.fieldsSearch.value) {
      this.taskService.list()
    }

    this.filters$.subscribe(input => {
      this.taskService.list({ task_like: input })
    })

    this.subscription = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
