import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-general-data',
  standalone: true,
  imports: [],
  templateUrl: './general-data.component.html',
})
export class GeneralDataComponent {
  @Input() simulationPeriod: string = '';
  @Input() simulationName: string = '';
  @Input() simulationIdentification: string = '';
}
