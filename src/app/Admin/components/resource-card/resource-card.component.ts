import { Component, Input } from '@angular/core';
import { Resource } from '../../models/resource.model';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss'],
  standalone: false,
})
export class ResourceCardComponent {
  @Input() resource!: Resource;
}
