import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component ({
  selector: 'app-section-iva-simulation',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './section-iva-simulation.component.html',
    styleUrl: './section-iva-simulation.component.scss'
})
export class SectionIvaSimulationComponent {
  @Input() sectionTitle: string = '';
  @Input() items: { label: string; value: string | number; isAutocalculated: boolean }[] = [];
  
  // Nuevas propiedades para SI/NO (manteniendo compatibilidad con ISR)
  @Input() hasToggle: boolean = false;
  @Input() toggleState: boolean = false;
  @Input() onToggle?: (value: boolean) => void;
  
  // Nueva propiedad para tablas directas (para tax-base)
  @Input() tableData?: { headers: string[]; rows: string[]; values: any[] } = undefined;
  
  // Propiedades para sub-secciones
  @Input() subsections?: { 
    title: string; 
    hasToggle: boolean; 
    toggleState: boolean; 
    onToggle: (value: boolean) => void;
    subsections?: { // Solo subsections, no nestedSubsections
      title: string;
      hasToggle: boolean;
      toggleState: boolean;
      onToggle: (value: boolean) => void;
      tableData?: { headers: string[]; rows: string[]; values: any }; // Cambiado para ser más flexible
    }[];
    tableData?: { headers: string[]; rows: string[]; values: any }; // Cambiado para ser más flexible
  }[] = [];

  handleToggle(value: boolean) {
    if (this.onToggle) {
      this.onToggle(value);
    }
  }

  handleSubsectionToggle(subsection: any, value: boolean) {
    subsection.onToggle(value);
  }
}
