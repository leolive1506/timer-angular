import { Injectable } from '@angular/core';
import { Task, UnsavedTask } from '../models/task';
import { HttpClient, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { CountdownService } from './countdown.service';
import { TaskFilters } from '../models/filters/task-filter';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private readonly API = 'http://localhost:3000/tasks'

  private taskSubject = new BehaviorSubject<Task[]>([])
  tasks$ = this.taskSubject.asObservable()
  activeTask: Task

  constructor(private http: HttpClient) { }

  list(filter: TaskFilters = {} as TaskFilters): void {
    let params = new HttpParams()
    if (Object.keys(filter).length > 0) {
      params = params.set('_limit', filter._limit)
    }

    this.http.get<Task[]>(this.API, { params }).subscribe(tasks => {
      this.taskSubject.next(tasks)
    })
  }

  create(task: UnsavedTask): Task {
    const newTask: Task = {
      task: task.task,
      secondsAmount: CountdownService.toSeconds(task.minutesAmount),
      createdAt: new Date(),
      finishedAt: null,
      interruptedAt: null
    }

    this.http.post<Task>(this.API, newTask).subscribe(task => {
      const tasks = this.taskSubject.getValue()
      tasks.unshift(task)
      this.activeTask = task
      this.taskSubject.next(tasks)
    })

    return newTask
  }

  update(task: Task): Observable<Task> {
    console.log('updated')
    const url = `${this.API}/${task.id}`
    return this.http.put<Task>(url, task)
  }

  updateTaskCompleted(): Observable<Task> {
    this.activeTask.finishedAt = new Date()
    const taskUpdate = this.update(this.activeTask)
    this.activeTask = null

    return taskUpdate
  }

  updateTaskInterrupt(): Observable<Task> {
    this.activeTask.interruptedAt = new Date()
    const taskUpdate = this.update(this.activeTask)
    this.activeTask = null

    return taskUpdate
  }

}
