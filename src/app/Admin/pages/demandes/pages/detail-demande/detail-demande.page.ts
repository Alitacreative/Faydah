import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Demande } from '../../model/demandes.interface';

@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.page.html',
  styleUrls: ['./detail-demande.page.scss'],
  standalone: false
})
export class DetailDemandePage implements OnInit {

  demand: Demande | null = null;
  notFound: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDemand(parseInt(id, 10));
    }
  }

  loadDemand(id: number): void {
    // Normalement, vous récupéreriez les données depuis un service
    // Pour l'exemple, nous simulons une récupération de données
    setTimeout(() => {
      const dummyData: Demande = {
        id: id,
        demandeur: 'Ahmed Benali',
        role: 'Disciple',
        type: 'Adhésion',
        sujet: "Demande d'adhésion à au Dahira ....",
        date: '10/05/2025',
        statut: 'En attente',
      };
      
      this.demand = dummyData;
    }, 500);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Approuvée': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
      case 'Rejetée': return 'bg-red-100 text-red-800';
      default: return '';
    }
  }

  goBack(): void {
    window.history.back();
  }
}
