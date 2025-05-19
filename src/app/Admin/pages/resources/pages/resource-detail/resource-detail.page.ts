import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourcesService } from '../../services/resource.service';
import { Resource } from '../../model/resource.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.page.html',
  styleUrls: ['./resource-detail.page.scss'],
  standalone:false,
})
export class ResourceDetailPage implements OnInit {
 resource!: Resource;
safeUrl!: SafeUrl;

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private sanitizer: DomSanitizer,
    private navController: NavController
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadResource(id);
    } else {
      this.navController.back();
    }
  }

  loadResource(id: string) {
    this.isLoading = true;
    const resource = this.resourcesService.getResourceById(id);
    
    if (resource) {
      this.resource = resource;
      
      // Sécurise l'URL pour l'affichage des médias
      if (resource.fileUrl) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resource.fileUrl);
      }
    } else {
      // Si la ressource n'existe pas, retourner à la liste
      this.navController.back();
    }
    
    this.isLoading = false;
  }

  getContentType(): string {
    if (!this.resource || !this.resource.fileType) {
      return 'unknown';
    }
    
    return this.resource.fileType;
  }

  goBack() {
    this.navController.back();
  }
}