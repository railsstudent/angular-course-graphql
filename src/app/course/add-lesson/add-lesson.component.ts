import { Language } from './../../generated/graphql';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewLessonInput } from '../type';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddLessonComponent implements OnInit {
  @Input()
  language: Language | undefined | null = undefined;

  @Output()
  submitNewLesson = new EventEmitter<NewLessonInput>();

  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(50)], updateOn: 'blur' }),
    });
  }

  onSubmit($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();

    if (!this.form.valid) {
      return;
    }
    this.submitNewLesson.emit(this.form.value.name);
  }
}
