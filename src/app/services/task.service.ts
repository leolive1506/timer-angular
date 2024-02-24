import { Injectable } from '@angular/core';
import { Task, UnsavedTask } from '../models/task';
import { HttpClient, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Subscription, lastValueFrom } from 'rxjs';
import { TaskFilters } from '../models/filters/task-filter';
import { Pagination } from '../models/pagination';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private readonly API = 'http://localhost:8080/tasks'

  private taskSubject = new BehaviorSubject<Pagination<Task>>({} as Pagination<Task>)
  taskPagination$ = this.taskSubject.asObservable()
  activeTask: Task

  // constructor(private http: HttpClient, private countdownService: CountdownService) { }
  constructor(private http: HttpClient, private router: Router) { }

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

  async create(task: UnsavedTask): Promise<Task> {
    const newTask = await lastValueFrom(this.http.post<Task>(this.API, task))
    const paginationTasks = this.taskSubject.getValue()

    paginationTasks.content.unshift(newTask)
    this.taskSubject.next(paginationTasks)
    this.activeTask = newTask

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
    const taskUpdate = this.update(this.activeTask, '/complete')
    this.activeTask = null
    console.log('finish update', taskUpdate)

    return taskUpdate
  }

  updateTaskInterrupt(): Task {
    const taskUpdate = this.update(this.activeTask, '/interrupt')
    this.activeTask = null

    console.log('interrupt update', taskUpdate)
    return taskUpdate
  }

  updateTaskContinue(task: Task): Subscription {
    const url = `${this.API}/${task.id}/continue`
    return this.http.put<Task>(url, task).subscribe(taskUpdated => {
      this.activeTask = taskUpdated

      const createdAt = new Date(taskUpdated.createdAt)
      const interruptedAt = new Date(taskUpdated.interruptedAt)
      const continuedAt = new Date(taskUpdated.continuedAt)
      const diff = continuedAt.getTime() - interruptedAt.getTime();

      console.log('createdAt', createdAt)
      console.log('interruptedAt', interruptedAt)
      console.log('CONTINUE TASK')
      console.log('continuedAt', continuedAt)

      const restAmount = Math.ceil(taskUpdated.secondsAmount - diff / (1000))
      this.activeTask.secondsRemaining = restAmount
      this.router.navigate(['']);
    })
  }

}
