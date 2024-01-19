import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { CountdownService } from 'src/app/services/countdown.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // providers: [CountdownService]
})

export class HomeComponent implements OnInit, OnDestroy {
  activeCycle: boolean = false

  minutesTemplate: string = ''
  secondsTemplate: string = ''
  taskSuggestions: Task[] = []

  subscription: Subscription

  form: FormGroup = this.formBuilder.group({
    task: ['', Validators.required],
    minutesAmount: [0, Validators.compose([
      Validators.required,
      Validators.min(1),
      Validators.max(60),
    ])]
  })

  constructor(
    private formBuilder: FormBuilder,
    private service: TaskService,
    private countdownService: CountdownService
  ) {
  }

  ngOnInit(): void {
    // this.service.list({ _limit: 3 })
    this.service.tasks$.subscribe(tasks => {
      this.taskSuggestions = tasks
    })

    this.subscription = this.countdownService.seconds$.subscribe({
      next: (number) => {
        if (number === 0 && this.activeCycle) {
          return this.completeTask()
        }

        this.setCountdownTemplate(number)
      }
    })

    this.activeCycle = !!this.service.activeTask
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  submit(): void {
    const task = this.service.create(this.form.value)
    this.countdownService.timer(task.secondsAmount)
    this.activeCycle = true

    this.form.reset()
  }

  interruptCycle(): void {
    this.service.updateTaskInterrupt()
    this.countdownService.cancelSubscription()
    this.initialState()
  }

  completeTask(): void {
    this.initialState()
  }

  initialState() {
    this.activeCycle = false;
    this.setCountdownTemplate(0)
  }

  setCountdownTemplate(number: number): void {
    const countdown = this.countdownService.toString(number)

    this.minutesTemplate = countdown.minutes
    this.secondsTemplate = countdown.seconds
  }

}
