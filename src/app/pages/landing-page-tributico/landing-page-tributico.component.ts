import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccordionComponent } from '../../components/landing-page/accordion/accordion.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CardBenefitsComponent } from '../../components/landing-page/card-benefits/card-landing-page.component';
import { CardHowWorksComponent } from '../../components/landing-page/card-how-works/card-how-works.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [AccordionComponent, CommonModule, MatIconModule, CardBenefitsComponent, CardHowWorksComponent, RouterLink],
  templateUrl: './landing-page-tributico.component.html',
})
export class LandingPageTributicoComponent implements AfterViewInit {
  public burgerMenuOpen: boolean = false;
  @ViewChild('hero') heroSection!: ElementRef;
  @ViewChild('benefits') benefitsSection!: ElementRef;
  @ViewChild('howItWorks') howItWorksSection!: ElementRef;
  @ViewChild('faq') faqSection!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  toggleBurgerMenu(): void {
    this.burgerMenuOpen = !this.burgerMenuOpen;
  }

  scrollTo(section: string) {
    switch (section) {
      case 'hero':
        this.heroSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'benefits':
        this.benefitsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'howItWorks':
        this.howItWorksSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'faq':
        this.faqSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }
}
