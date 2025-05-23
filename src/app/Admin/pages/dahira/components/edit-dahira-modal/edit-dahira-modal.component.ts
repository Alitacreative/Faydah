import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dahira } from '../../models/dahira.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-dahira-modal',
  templateUrl: './edit-dahira-modal.component.html',
  imports: [ CommonModule, ReactiveFormsModule ]
})
export class EditDahiraModalComponent implements OnInit {
  @Input() dahira!: Dahira;
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
    // Préremplir le formulaire avec les données du Dahira
    this.dahiraForm.patchValue({
      name: this.dahira.name,
      location: this.dahira.location || ''
    });
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