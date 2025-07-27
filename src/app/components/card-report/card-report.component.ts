import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-report',
  standalone: true,
  imports: [],
  templateUrl: './card-report.component.html'
})
export class CardReportComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = '';
  @Output() callClickMethod: EventEmitter<any> = new EventEmitter<any>();

  onButtonClick() {
    this.callClickMethod.emit();
  }
}
