import { Injectable } from '@angular/core';
import { Task } from '../models/Task';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private readonly API = 'http://localhost:3000/tasks'

  constructor(private http: HttpClient) { }

  list(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API)
  }

  create(task: Task): Observable<Task> {
    const newTask = {...task, createdAt: new Date()}
    return this.http.post<Task>(this.API, newTask)
  }

}
