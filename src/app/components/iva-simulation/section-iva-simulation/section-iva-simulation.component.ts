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
  
  @Input() hasToggle: boolean = false;
  @Input() toggleState: boolean = false;
  @Input() onToggle?: (value: boolean) => void;
  
  @Input() tableData?: { headers: string[]; rows: string[]; values: any[] } = undefined;
  
  @Input() subsections?: { 
    title: string; 
    hasToggle: boolean; 
    toggleState: boolean; 
    onToggle: (value: boolean) => void;
    subsections?: { 
      title: string;
      hasToggle: boolean;
      toggleState: boolean;
      onToggle: (value: boolean) => void;
      tableData?: { headers: string[]; rows: string[]; values: any }; 
    }[];
    tableData?: { headers: string[]; rows: string[]; values: any }; 
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
