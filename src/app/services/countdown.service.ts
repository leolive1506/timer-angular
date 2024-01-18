import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { timer } from 'rxjs';
import { CountdownTemplate } from '../models/CountdownTemplate';

@Injectable({
  providedIn: 'root'
})

export class CountdownService {
  private secondsSubject = new BehaviorSubject(0);
  seconds$ = this.secondsSubject.asObservable()

  currentSeconds: number;
  subscription: Subscription;

  timer(seconds: number) {
    this.secondsSubject.next(seconds)

    let currentSeconds = this.secondsSubject.value
    let isNumberValid = currentSeconds > 0

    const observable = timer(1000, 1000)
    
    this.subscription = observable.subscribe({
      next: () => {
        if (isNumberValid) {
          isNumberValid = --currentSeconds > 0
          this.secondsSubject.next(currentSeconds)
        } else {
          this.secondsSubject.complete()
        }
      },
    })

    if (!isNumberValid) {
      this.cancelSubscription()
    }
  }

  constructor() {}

  cancelSubscription() {
    this.subscription.unsubscribe()
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
