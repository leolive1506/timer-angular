import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, repeat, takeUntil } from 'rxjs';
import { timer } from 'rxjs';
import { CountdownTemplate } from '../models/countdown-template';

@Injectable({
  providedIn: 'root'
})

export class CountdownService {
  private secondsSubject = new BehaviorSubject(0);
  private _stop = new Subject<void>()

  seconds$: Observable<number> = this.secondsSubject.asObservable()

  currentSeconds: number;
  subscription: Subscription;

  constructor() {

  }

  timer(seconds: number) {
    this.secondsSubject.next(seconds)

    let currentSeconds = this.secondsSubject.value
    let isNumberValid = currentSeconds > 0

    const observable = timer(1000, 1000)

    this.subscription = observable.pipe(
      takeUntil(this._stop)
    ).subscribe({
      next: () => {
        if (isNumberValid) {
          isNumberValid = --currentSeconds > 0
          console.log('CurrentSeconds: ', currentSeconds)

          this.secondsSubject.next(currentSeconds)
        } else {
          this.stop()
        }
      },
      complete: () => this.cancelSubscription()
    })
  }

  cancelSubscription() {
    this.secondsSubject.next(0)
    this.subscription.unsubscribe()
  }

  stop(): void {
    this._stop.next();
  }

  static toSeconds(minutes: number) {
    return minutes * 60;
  }

  toString(seconds: number): CountdownTemplate {
    const minutesAmount = Math.floor(seconds / 60)
    const secondsAmount = seconds % 60

    return {
      minutes: String(minutesAmount).padStart(2, '0'),
      seconds: String(secondsAmount).padStart(2, '0'),
    }
  }
}
