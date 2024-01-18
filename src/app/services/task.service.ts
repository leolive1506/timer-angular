import { Injectable } from '@angular/core';
import { Task, UnsaveTask } from '../models/Task';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { CountdownService } from './countdown.service';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private readonly API = 'http://localhost:3000/tasks'

  constructor(private http: HttpClient) { }

  list(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API)
  }

  create(task: UnsaveTask): Observable<Task> {
    const newTask: Task = {
      task: task.task,
      secondsAmount: CountdownService.toSeconds(task.minutesAmount),
      createdAt: new Date()
    }

    return this.http.post<Task>(this.API, newTask)
  }

}
