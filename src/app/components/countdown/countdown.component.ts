import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent {
  @Input() minutes: string = '';
  @Input() seconds: string = '';
}
