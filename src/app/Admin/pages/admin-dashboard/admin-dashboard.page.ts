import { Component, OnInit } from '@angular/core';
// import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: false
})
export class AdminDashboardPage implements OnInit {
  chartOptions: any;

  constructor() {
    // Chart.register(...registerables);
  }

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    this.chartOptions = {
      series: [{
        name: 'Cotisations',
        data: ['500', "700", "800", "600", "900", "1000", "950", "1200"]
      }],
      chart: {
        type: 'area',
        height: 300,
        stacked: false,
        toolbar: {
          show: false
        },
      },
      colors: ['#15BB25FF'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth', // Cela crée l'effet "spline"
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout'],
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Montant (XAF)',
          style: {
            color: '#6B7280'
          }
        },
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: number) {
            return val + " F";
          }
        }
      }
    };
  }

  loadMonthlyChart() {
    this.chartOptions = {
      series: [{
        name: 'Cotisations',
        data: [500, 700, 800, 600, 900, 1000]
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#36a2eb'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }
}