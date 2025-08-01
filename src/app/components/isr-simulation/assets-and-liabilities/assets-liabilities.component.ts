import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-assets-liabilities',
  standalone: true,
  imports: [],
  templateUrl: './assets-liabilities.component.html',
})
export class AssetsLiabilitiesComponent {
  @Input() currentAssets: number = 0;
  @Input() equityInvestments: number = 0;
  @Input() inventory: number = 0;
  @Input() netFixedAssets: number = 0;
  @Input() totalNetAssets: number = 0;
  @Input() totalLiabilities: number = 0;
  @Input() netEquity: number = 0;
}
