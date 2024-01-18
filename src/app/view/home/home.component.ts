import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    task: [''],
    minutesAmount: [0]
  })

  constructor(
    private formBuilder: FormBuilder,
    private service: TaskService,
    private countdownService: CountdownService
  ) {
  }

  ngOnInit(): void {
    console.log('ngOnInit')
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
    this.service.updateTaskInterrupt().subscribe()
    this.subscription.unsubscribe()
    this.countdownService.cancelSubscription()
    this.setCountdownTemplate(0)
    this.initialState()
  }

  completeTask(): void {
    this.service.updateTaskCompleted().subscribe(data => console.log('finish update', data))
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
