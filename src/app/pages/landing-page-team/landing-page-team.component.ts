import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CardCorporateIdentityComponent } from '../../components/card-corporate-identity/card-corporate-identity.component';
import { CommonModule } from '@angular/common';
import { CardTeamMemberComponent } from '../../components/card-team-member/card-team-member.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page-team',
  standalone: true,
  imports: [MatIconModule, CardCorporateIdentityComponent, CommonModule, CardTeamMemberComponent, RouterLink],
  templateUrl: './landing-page-team.component.html',
})
export class LandingPageTeamComponent {
  public burgerMenuOpen: boolean = false;
  @ViewChild('hero') heroSection!: ElementRef;
  @ViewChild('missionAndVision') missionAndVisionSection!: ElementRef;
  @ViewChild('values') valuesSection!: ElementRef;
  @ViewChild('members') membersSection!: ElementRef;
  @ViewChild('projects') projectsSection!: ElementRef;

  toggleBurgerMenu(): void {
    this.burgerMenuOpen = !this.burgerMenuOpen;
  }

  scrollTo(section: string) {
    switch (section) {
      case 'hero':
        this.heroSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'missionAndVision':
        this.missionAndVisionSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'values':
        this.valuesSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'members':
        this.membersSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'projects':
        this.projectsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }

  currentSlide = 0;
  totalSlides = 5;

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlide = index;
    }
  }

  startAutoPlay(intervalMs: number = 3000): void {
    setInterval(() => {
      this.nextSlide();
    }, intervalMs);
  }

  isFirstSlide(): boolean {
    return this.currentSlide === 0;
  }

  isLastSlide(): boolean {
    return this.currentSlide === this.totalSlides - 1;
  }

  getCurrentSlideNumber(): number {
    return this.currentSlide + 1;
  }
}
