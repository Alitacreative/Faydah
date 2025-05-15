import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, Contributor } from '../../models/projet.model';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-projet',
  templateUrl: './detail-projet.component.html',
  styleUrls: ['./detail-projet.component.scss'],
  imports: [CommonModule],
})
export class DetailProjetComponent  implements OnInit {
  project: Project | undefined;
  totalContribution: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.project = this.projectService.getProjectById(id);
      if (this.project && this.project.contributors) {
        this.totalContribution = this.project.contributors.reduce((sum, contributor) => sum + contributor.amount, 0);
      }
    }
  }

  goBack() {
    this.router.navigate(['admin/projets']);
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'en_cours': 'En cours',
      'en_attente': 'En attente',
      'termine': 'Terminé'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'en_cours': 'bg-green-100 text-green-800',
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'termine': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || '';
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
