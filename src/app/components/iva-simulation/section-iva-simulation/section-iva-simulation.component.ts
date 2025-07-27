import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component ({
  selector: 'app-section-iva-simulation',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './section-iva-simulation.component.html',
})
export class SectionIvaSimulationComponent {
  @Input() sectionTitle: string = '';
  @Input() items: { label: string; value: number; isAutocalculated: boolean }[] = [];
}
