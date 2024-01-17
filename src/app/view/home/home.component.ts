import { Component, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  activeCycle: boolean = false;
  form: FormGroup = this.formBuilder.group({
    project: ['Nome projecto'],
    minutesAmount: [4]
  })

  constructor(private formBuilder: FormBuilder) {}

  submit() {
    console.log('submit: ', this.form.value)
  }
}
