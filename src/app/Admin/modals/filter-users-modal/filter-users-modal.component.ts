import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-users-modal',
  templateUrl: './filter-users-modal.component.html',
  styleUrls: ['./filter-users-modal.component.scss'],
  standalone: false,
})
export class FilterUsersModalComponent implements OnInit {
  filters = {
    categories: {
      disciples: true,
      dahira: true,
      mouqadam: true,
      visiteurs: true,
      respDahira: true
    },
    status: {
      active: true,
      inactive: false,
      pending: false
    },
    dateRange: {
      from: '',
      to: ''
    },
    sortBy: 'name-asc' // Options: name-asc, name-desc, date-asc, date-desc
  };

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  applyFilters() {
    this.modalController.dismiss(this.filters);
  }

  resetFilters() {
    this.filters = {
      categories: {
        disciples: true,
        dahira: true,
        mouqadam: true,
        visiteurs: true,
        respDahira: true
      },
      status: {
        active: true,
        inactive: false,
        pending: false
      },
      dateRange: {
        from: '',
        to: ''
      },
      sortBy: 'name-asc'
    };
  }
}