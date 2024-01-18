import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CountdownTemplate } from 'src/app/models/CountdownTemplate';
import { Task } from 'src/app/models/Task';
import { CountdownService } from 'src/app/services/countdown.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  activeCycle: boolean = false

  minutesTemplate: string = ''
  secondsTemplate: string = ''

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
    this.subscription = this.countdownService.seconds$.subscribe(number => {
      this.setCountdownTemplate(number)
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  submit() {
    this.service.create(this.form.value).subscribe(data => {
      this.countdownService.timer(data.secondsAmount)
      this.activeCycle = true
    })
    this.form.reset()
  }

  interruptCycle() {
    this.subscription.unsubscribe()
    this.countdownService.cancelSubscription()
    this.setCountdownTemplate(0)
  }

  setCountdownTemplate(number: number): void {
    const countdown = this.countdownService.toString(number)

    this.minutesTemplate = countdown.minutes
    this.secondsTemplate = countdown.seconds
  }

}
