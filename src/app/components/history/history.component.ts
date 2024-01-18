import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  tasks: Task[] = []
  subscription: Subscription
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.list()
    this.subscription = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
