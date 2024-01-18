import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  tasks: Task[] = []
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.list().subscribe(tasks => {
      this.tasks = tasks
    })
  }
}
