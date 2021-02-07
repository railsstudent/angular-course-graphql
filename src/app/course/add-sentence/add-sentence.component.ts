import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-sentence',
  templateUrl: './add-sentence.component.html',
  styleUrls: ['./add-sentence.component.scss']
})
export class AddSentenceComponent implements OnInit {
  form = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();

    if (!this.form.valid) {
      return;
    }
    // this.submitNewLesson.emit({ name: this.form.value.name });
  }
}
