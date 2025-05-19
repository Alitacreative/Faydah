import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Resource } from '../../pages/resources/model/resource.model';

@Component({
  selector: 'app-add-resource-modal',
  templateUrl: './add-resource-modal.component.html',
  styleUrls: ['./add-resource-modal.component.scss'],
  standalone: false,
})
export class AddResourceModalComponent implements OnInit {
  @Input() isEdit = false;
  @Input() resource: Partial<Resource> = {};

  resourceForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  categories = ['Zikrs', 'Livres', 'Conférences', 'Tafsirs'];

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();

    if (this.isEdit && this.resource) {
      this.resourceForm.patchValue({
        title: this.resource.title,
        description: this.resource.description,
        category: this.resource.category,
        fileType: this.resource.fileType,
        file: null,  // pas de fichier à patcher
      });

      if (this.resource.fileUrl) {
        this.previewUrl = this.resource.fileUrl;
      }
    }
  }

  initForm() {
    this.resourceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['Conférences', Validators.required],
      fileType: [''],         // gardé non obligatoire, sera set en JS
      file: [null, Validators.required],  // fichier obligatoire pour validation
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.resourceForm.patchValue({ file });

      if (file.type.includes('image')) {
        this.resourceForm.patchValue({ fileType: 'image' });
        this.createPreview(file);
      } else if (file.type.includes('pdf')) {
        this.resourceForm.patchValue({ fileType: 'pdf' });
        this.previewUrl = null;
      } else if (file.type.includes('video')) {
        this.resourceForm.patchValue({ fileType: 'video' });
        this.previewUrl = null;
      } else if (file.type.includes('audio')) {
        this.resourceForm.patchValue({ fileType: 'audio' });
        this.previewUrl = null;
      } else {
        this.resourceForm.patchValue({ fileType: '' });
        this.previewUrl = null;
      }
    }
  }

  createPreview(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  cancel() {
    this.modalController.dismiss();
  }

  submit() {
    if (this.resourceForm.valid && this.selectedFile) {
      const formData = this.resourceForm.value;

      const newResource: Partial<Resource> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileType: formData.fileType,
        dateAdded: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        author: 'Dr. Ahmed',
        fileUrl: URL.createObjectURL(this.selectedFile)
      };

      this.modalController.dismiss({
        resource: newResource
      });
    } else {
      alert('Veuillez remplir tous les champs et sélectionner un fichier.');
    }
  }
}
