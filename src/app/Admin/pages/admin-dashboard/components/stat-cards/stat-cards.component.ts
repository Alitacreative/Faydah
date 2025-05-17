import { Component, OnInit } from '@angular/core';
import { StatCard } from '../../models/dashboard.model'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-cards',
  templateUrl: './stat-cards.component.html',
  styleUrls: ['./stat-cards.component.scss'],
  imports: [CommonModule]
})
export class StatCardsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  statCards: StatCard[] = [
    { 
      title: 'Disciples', 
      value: '438', 
      change: '+8%', 
      colorClass: 'text-blue-500', 
      iconColorClass: 'bg-blue-100',
      icon: 'users' 
    },
    { 
      title: 'Dahiras', 
      value: '28', 
      change: '+8%', 
      colorClass: 'text-green-500', 
      iconColorClass: 'bg-green-100',
      icon: 'group' 
    },
    { 
      title: 'Mouquadam', 
      value: '12', 
      change: '+8%', 
      colorClass: 'text-red-400', 
      iconColorClass: 'bg-red-100',
      icon: 'users' 
    },
    { 
      title: 'Cotisations', 
      value: '15 000 XOF', 
      change: '+8%', 
      colorClass: 'text-blue-500', 
      iconColorClass: 'bg-blue-100',
      icon: 'cash' 
    },
    { 
      title: 'Levée des fonds', 
      value: '12', 
      change: '', 
      colorClass: 'text-gray-800', 
      iconColorClass: 'bg-gray-100',
      icon: 'chart' 
    }
  ];
}
