import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: false
})
export class AdminDashboardPage implements OnInit {
  constructor() {
    Chart.register(...registerables); // Enregistrer les composants de Chart.js
  }

  ngOnInit() {
    this.loadMonthlyChart();
  }

  loadMonthlyChart() {
    const ctx = document.getElementById('monthlyChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar', // Type de graphique (barres)
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Mois
        datasets: [
          {
            label: 'Cotisations',
            data: [500, 700, 800, 600, 900, 1000], // Données
            backgroundColor: 'rgba(54, 162, 235, 0.5)', // Couleur des barres
            borderColor: 'rgba(54, 162, 235, 1)', // Couleur des bordures
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }
}