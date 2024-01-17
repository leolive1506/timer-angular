import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  seconds: number
  minutesTemplate: string = ''
  secondsTemplate: string = ''

  subscription: Subscription

  form: FormGroup = this.formBuilder.group({
    project: [''],
    minutesAmount: [0]
  })

  constructor(
    private formBuilder: FormBuilder,
    private service: TaskService,
    private countdownService: CountdownService
  ) {}

  ngOnInit(): void {
    this.subscription = this.countdownService.seconds$.subscribe(number => {
      const timerTemplate = this.countdownService.toString(number)
      this.minutesTemplate = timerTemplate.minutes
      this.secondsTemplate = timerTemplate.seconds
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  submit() {
    this.service.create(this.form.value).subscribe(data => {
      this.seconds = this.countdownService.toSeconds(data.minutesAmount)
      this.countdownService.timer(this.seconds)
    })
  }

}
