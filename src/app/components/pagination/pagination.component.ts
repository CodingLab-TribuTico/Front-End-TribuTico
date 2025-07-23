import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() service: any;
  @Output() callCustomPaginationMethod = new EventEmitter<void>();
  @Input() customCall: boolean = false;
  public Math = Math;

  onPage(pPage: number) {
    this.service.search.page = pPage;

    if (this.customCall) {
      this.callCustomPaginationMethod.emit();
    } else {
      this.service.getAll();
    }
  }

  get pageRange(): number[] {
    return Array.from({ length: this.service.search.totalPages ?? 0 }, (_, i) => i + 1);
  }
}