import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Dahira } from '../../models/dahira.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-dahira-modal',
  templateUrl: './add-dahira-modal.component.html',
  styleUrls: ['./add-dahira-modal.component.scss'],
  imports: [ CommonModule, ReactiveFormsModule ]
})
export class AddDahiraModalComponent  implements OnInit {

  @Output() save = new EventEmitter<Partial<Dahira>>();
  @Output() cancel = new EventEmitter<void>();
  
  dahiraForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.dahiraForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['']
    });
  }
  
  ngOnInit(): void {
  }
  
  onSubmit(): void {
    if (this.dahiraForm.valid) {
      this.save.emit(this.dahiraForm.value);
    } else {
      this.dahiraForm.markAllAsTouched();
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}