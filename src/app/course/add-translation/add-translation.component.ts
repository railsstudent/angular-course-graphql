import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Language, Sentence } from './../../generated/graphql';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-translation',
  templateUrl: './add-translation.component.html',
  styleUrls: ['./add-translation.component.scss']
})
export class AddTranslationComponent implements OnInit, OnChanges {
  @Input()
  languages: Language[] | undefined | null = [];

  @Input()
  sentences: Sentence[] | undefined | null = [];

  @Output()
  submitNewTranlsation = new EventEmitter();

  form = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      text: new FormControl('', { validators: [Validators.required, Validators.maxLength(50)], updateOn: 'blur' }),
      sentenceId: new FormControl(this.sentences?.[0]?.id, { validators: Validators.required, updateOn: 'change' }),
      languageId: new FormControl(this.languages?.[0]?.id, { validators: Validators.required, updateOn: 'change' })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { languages, sentences } = changes;
    if (languages) {
      const { currentValue = [] } = languages;
      const languageId = currentValue?.[0]?.id || '';
      const languageControl = this.form.controls.languageId;
      if (languageControl) {
        languageControl.setValue(languageId);
      }
    }

    if (sentences) {
      const { currentValue: sentenceCurrentValue = [] } = sentences;
      const sentenceId = sentenceCurrentValue?.[0]?.id || '';
      const sentenceControl = this.form.controls.sentenceId;
      if (sentenceControl) {
        sentenceControl.setValue(sentenceId);
      }
    }
  }

  onSubmit($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();

    if (!this.form.valid) {
      return;
    }
    this.submitNewTranlsation.emit(this.form.value);
  }
}
