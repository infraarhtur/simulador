import { Injectable } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseControl } from './Models/dynamicControls/base-control';


@Injectable()
export class DynamicControlService {

  constructor() { }
  toFormGroup(questions: BaseControl<any>[]) {
    const group: any = {};
    try {
      if (questions !== undefined) {
        questions.forEach(function (question) {

          group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
            : new FormControl(question.value || '');
        });
      }

    } catch (error) {
      console.log('error fail - dinamic Control');
      console.log(error);

    }
    return new FormGroup(group);
  }

}
