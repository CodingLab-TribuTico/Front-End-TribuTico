import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-team-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-team-member.component.html'
})
export class CardTeamMemberComponent {
  @Input() name: string = '';
  @Input() position: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Input() altImageText: string = '';
  @Input() linkedinUrl: string = '';
  @Input() githubUrl: string = '';
}
