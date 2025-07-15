import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './accordion.component.html',
})
export class AccordionComponent {
  public icon: boolean = true;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() index: number = 0;

  toggleAccordion(index: number): void {
    const content = document.getElementById(`content-${index}`);

    if (content) {
      if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0';
        this.icon = true;
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        this.icon = false;
      }
    }
  }
}
