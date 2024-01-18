import { Injectable } from '@angular/core';
import { Task, UnsavedTask } from '../models/Task';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { CountdownService } from './countdown.service';
import { TaskFilters } from '../models/filters/task-filter';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private readonly API = 'http://localhost:3000/tasks'

  constructor(private http: HttpClient) { }

  list(filter: TaskFilters = {} as TaskFilters): Observable<Task[]> {
    let params = new HttpParams()
    if (Object.keys(filter).length > 0) {
      params = params.set('_limit', filter._limit)
    }

    return this.http.get<Task[]>(this.API, { params })
  }

  create(task: UnsavedTask): Observable<Task> {
    const newTask: Task = {
      task: task.task,
      secondsAmount: CountdownService.toSeconds(task.minutesAmount),
      createdAt: new Date(),
      finishedAt: null,
      interruptedAt: null
    }

    return this.http.post<Task>(this.API, newTask)
  }

  update(task: Task): Observable<Task> {
    const url = `${this.API}/${task.id}`
    return this.http.put<Task>(url, task)
  }

  updateTaskCompleted(task: Task): Observable<Task> {
    task.finishedAt = new Date()
    return this.update(task)
  }

  updateTaskInterrupt(task: Task) {
    task.interruptedAt = new Date()
    return this.update(task)
  }

}
