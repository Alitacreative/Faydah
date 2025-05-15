import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Project } from '../../models/projet.model';

@Component({
  selector: 'app-edit-projet-modal',
  templateUrl: './edit-projet-modal.component.html',
  styleUrls: ['./edit-projet-modal.component.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class EditProjetModalComponent  implements OnInit {

  @Input() project!: Project;
  projectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      title: [this.project.title, [Validators.required]],
      description: [this.project.description, [Validators.required]],
      status: [this.project.status, [Validators.required]],
      progress: [this.project.progress, [Validators.required, Validators.min(0), Validators.max(100)]],
      dueDate: [this.formatDateForInput(new Date(this.project.dueDate)), [Validators.required]]
    });
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
        status: this.projectForm.value.status,
        progress: this.projectForm.value.progress,
        dueDate: new Date(this.projectForm.value.dueDate)
      };
      
      this.modalController.dismiss({
        project: updatedProject
      });
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}
