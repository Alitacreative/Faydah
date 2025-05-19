import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-resource-filter',
  templateUrl: './resource-filter.component.html',
  styleUrls: ['./resource-filter.component.scss'],
  standalone: false,
})
export class ResourceFilterComponent implements OnInit {
  @Output() filterSelected = new EventEmitter<string>();
  
  categories = [
    { id: 'Toutes', label: 'Toutes' },
    { id: 'Zikrs', label: 'Zikrs' },
    { id: 'Livres', label: 'Livres' },
    { id: 'Conférences', label: 'Conférences' },
    { id: 'Tafsirs', label: 'Tafsirs' }
  ];
  
  selectedCategory: string = 'Toutes';

  constructor() { }

  ngOnInit() {}

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterSelected.emit(category);
  }

  isSelected(category: string): boolean {
    return this.selectedCategory === category;
  }
}