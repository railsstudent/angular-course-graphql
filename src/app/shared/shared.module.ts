import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertErrorComponent } from './alert-error/alert-error.component';
import { AlertSuccessComponent } from './alert-success/alert-success.component';

@NgModule({
  declarations: [AlertErrorComponent, AlertSuccessComponent],
  imports: [
    CommonModule,
  ],
  exports: [AlertErrorComponent, AlertSuccessComponent]
})
export class SharedModule { }
