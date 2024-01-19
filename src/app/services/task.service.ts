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
  private readonly API = 'http://localhost:8080/tasks'

  private taskSubject = new BehaviorSubject<Task[]>([])
  tasks$ = this.taskSubject.asObservable()
  activeTask: Task

  constructor(private http: HttpClient) { }

  list(filter: TaskFilters = {} as TaskFilters): void {
    console.log('list ', filter)
    let params = new HttpParams()
    const keysFilters = Object.keys(filter)

    if (keysFilters.length > 0) {
      keysFilters.forEach(key => {
        console.log(key, filter[key])
        params = params.set(key, filter[key])
      })
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

  update(task: Task, aditionalPathUrl: string = ''): Task {
    const url = `${this.API}/${task.id}${aditionalPathUrl}`
    this.http.put<Task>(url, task).subscribe(taskUpdated => {
      task = taskUpdated
      const tasks = this.taskSubject.getValue()
      const index = tasks.findIndex(item => item.id === task.id)
      tasks[index] = task
      this.taskSubject.next(tasks)
    })

    return task
  }

  updateTaskCompleted(): Task {
    this.activeTask.finishedAt = new Date()
    const taskUpdate = this.update(this.activeTask, '/complete')
    this.activeTask = null
    console.log('finish update', taskUpdate)

    return taskUpdate
  }

  updateTaskInterrupt(): Task {
    this.activeTask.interruptedAt = new Date()
    const taskUpdate = this.update(this.activeTask, '/interrupt')
    this.activeTask = null

    console.log('interrupt update', taskUpdate)
    return taskUpdate
  }

}
