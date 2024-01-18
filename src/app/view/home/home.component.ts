import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { CountdownService } from 'src/app/services/countdown.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  activeCycle: boolean = false
  task: Task;

  minutesTemplate: string = ''
  secondsTemplate: string = ''
  taskSuggestions: Task[] = []

  subscription: Subscription

  form: FormGroup = this.formBuilder.group({
    task: [''],
    minutesAmount: [0]
  })

  constructor(
    private formBuilder: FormBuilder,
    private service: TaskService,
    private countdownService: CountdownService
  ) {}

  ngOnInit(): void {
    this.service.list({ _limit: 3 }).subscribe(tasks => {
      this.taskSuggestions = tasks
    })

    this.subscription = this.countdownService.seconds$.subscribe({
      next: (number) => {
        this.setCountdownTemplate(number)
      },
      complete: () => this.completeTask()
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  submit(): void {
    this.service.create(this.form.value).subscribe(data => {
      this.task = data
      this.countdownService.timer(data.secondsAmount)
      this.activeCycle = true
    })
    this.form.reset()
  }

  interruptCycle(): void {
    this.service.updateTaskInterrupt(this.task).subscribe()
    this.subscription.unsubscribe()
    this.countdownService.cancelSubscription()
    this.setCountdownTemplate(0)
    this.initialState()
  }

  completeTask(): void {
    this.service.updateTaskCompleted(this.task).subscribe()
    this.initialState()
  }

  initialState() {
    this.task = null
    this.activeCycle = false;
  }

  setCountdownTemplate(number: number): void {
    const countdown = this.countdownService.toString(number)

    this.minutesTemplate = countdown.minutes
    this.secondsTemplate = countdown.seconds
  }

}
