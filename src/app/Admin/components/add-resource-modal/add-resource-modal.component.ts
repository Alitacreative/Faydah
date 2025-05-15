import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Resource } from '../../pages/ressources/models/resource.model';

@Component({
  selector: 'app-add-resource-modal',
  templateUrl: './add-resource-modal.component.html',
  styleUrls: ['./add-resource-modal.component.scss'],
  standalone: false,
})
export class AddResourceModalComponent implements OnInit {
  resourceForm!: FormGroup;
  resourceTypes = ['Zikrs', 'Livres', 'Conférences', 'Tafsirs'];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.resourceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['Conférences', Validators.required]
    });
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(): void {
    if (this.resourceForm.valid) {
      const today = new Date();
      const formattedDate = `${today.getDate()} ${today.toLocaleString('fr-FR', { month: 'long' })} ${today.getFullYear()}`;

      const newResource: Resource = {
        id: Date.now().toString(),
        title: this.resourceForm.get('title')?.value || '',
        description: this.resourceForm.get('description')?.value || '',
        type: this.resourceForm.get('type')?.value || 'Conférences',
        dateAdded: formattedDate
      };

      this.modalCtrl.dismiss(newResource, 'confirm');
    } else {
      // Optionnel : feedback à l'utilisateur si invalide
      this.resourceForm.markAllAsTouched(); // pour afficher les erreurs
    }
  }
}
