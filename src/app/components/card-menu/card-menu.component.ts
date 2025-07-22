import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './card-menu.component.html',
})
export class CardMenuComponent {
  @Input() icons: string[] = [];
  @Input() title: string = "";
  @Input() description: string = "";
  @Input() firstButtonText: string = "";
  @Input() firstButtonBackgroundColor: string = "";
  @Input() firstButtonTextColor: string = "";
  @Input() firstButtonHoverTextColor: string = "";
  @Input() firstButtonHoverBgColor: string = "";
  @Input() secondButtonText: string = "";
  @Input() secondButtonBackgroundColor: string = "";
  @Input() secondButtonTextColor: string = "";
  @Input() secondButtonHoverTextColor: string = "";
  @Input() secondButtonHoverBgColor: string = "";
  @Input() iconsColor: string = "text-bisque";
  @Input() backgroundColor: string = "bg-crater-brown";
  @Input() textColor: string = "text-bisque";
  @Input() firstButtonRoute: string = "";
  @Input() secondButtonRoute: string = "";
}
