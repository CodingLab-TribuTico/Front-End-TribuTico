import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-isr-simulation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-isr-simulation.component.html',
  styleUrl: './section-isr-simulation.component.scss'
})
export class SectionIsrSimulationComponent {
  @Input() sectionTitle: string = '';
  @Input() items: { label: string; value: number; isAutocalculated: boolean }[] = [];

}
