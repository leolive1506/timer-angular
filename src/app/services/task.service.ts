import { Injectable } from '@angular/core';
import { Task, UnsavedTask } from '../models/task';
import { HttpClient, HttpParams } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { CountdownService } from './countdown.service';
import { TaskFilters } from '../models/filters/task-filter';
import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private readonly API = 'http://localhost:8080/tasks'

  private taskSubject = new BehaviorSubject<Pagination<Task>>({} as Pagination<Task>)
  taskPagination$ = this.taskSubject.asObservable()
  activeTask: Task

  constructor(private http: HttpClient) { }

  list(filter: TaskFilters = {} as TaskFilters): void {
    let params = new HttpParams()
    const keysFilters = Object.keys(filter)

    if (keysFilters.length > 0) {
      keysFilters.forEach(key => {
        params = params.set(key, filter[key])
      })
    }

    this.http.get<Pagination<Task>>(this.API, { params }).subscribe(tasks => {
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
      const paginationTasks = this.taskSubject.getValue()
      paginationTasks.content.unshift(task)
      this.taskSubject.next(paginationTasks)
      this.activeTask = task
    })

    return newTask
  }

  update(task: Task, aditionalPathUrl: string = ''): Task {
    const url = `${this.API}/${task.id}${aditionalPathUrl}`
    this.http.put<Task>(url, task).subscribe(taskUpdated => {
      task = taskUpdated
      const paginationTasks = this.taskSubject.getValue()
      const index = paginationTasks.content.findIndex(item => item.id === task.id)
      paginationTasks.content[index] = task
      this.taskSubject.next(paginationTasks)
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
