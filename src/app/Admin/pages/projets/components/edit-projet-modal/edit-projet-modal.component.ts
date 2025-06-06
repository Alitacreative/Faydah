import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../models/projet.model';

@Component({
  selector: 'app-edit-projet-modal',
  templateUrl: './edit-projet-modal.component.html',
  styleUrls: ['./edit-projet-modal.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditProjetModalComponent implements OnInit {

  @Input() project!: Project;
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Project>();
  projectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.projectForm = this.fb.group({
      title: [this.project.title, [Validators.required]],
      description: [this.project.description, [Validators.required]],
      status: [this.project.status, [Validators.required]],
      progress: [this.project.progress, [Validators.required, Validators.min(0), Validators.max(100)]],
      dueDate: [this.formatDateForInput(new Date(this.project.dueDate)), [Validators.required]]
    });

    // Mise à jour automatique de la progression en fonction du statut
    this.projectForm.get('status')?.valueChanges.subscribe(status => {
      if (status === 'termine') {
        this.projectForm.get('progress')?.setValue(100);
      }
    });

    this.projectForm.get('progress')?.valueChanges.subscribe(progress => {
      if (progress === 100) {
        this.projectForm.get('status')?.setValue('termine');
      }
    })

    this.projectForm.get('progress')?.valueChanges.subscribe(progress => {
      if (progress !== 100) {
        this.projectForm.get('status')?.setValue('en_cours');
      }
    })
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const updatedProject: Project = {
        ...this.project,
        title: this.projectForm.value.title,
        description: this.projectForm.value.description,
        status: this.projectForm.value.progress === 100 ? "termine" : this.projectForm.value.status,
        progress: this.projectForm.value.progress,
        dueDate: new Date(this.projectForm.value.dueDate)
      };

      this.submit.emit(updatedProject);
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.projectForm.controls).forEach(key => {
        const control = this.projectForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
