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
  public Math = Math;

  @Input() service: any;
  @Input() page: number = 1;
  @Input() totalPages: number = 1;
  @Input() customCall: boolean = false;

  @Input() pageSize: number = 10;
  @Input() totalElements: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  get effectivePage(): number {
    return this.service ? this.service.search.page : this.page;
  }

  get effectivePageSize(): number {
    return this.service ? (this.service.search.pageSize ?? 10) : this.pageSize;
  }

  get effectiveTotalElements(): number {
    return this.service ? (this.service.search.totalElements ?? 0) : this.totalElements;
  }

  get effectiveTotalPages(): number {
    if (this.service) {
      return this.service.search.totalPages ?? 1;
    }
    return this.totalPages;
  }

  get pageRange(): number[] {
    return Array.from({ length: this.effectiveTotalPages }, (_, i) => i + 1);
  }

  onPage(pPage: number) {
    if (pPage < 1 || pPage > this.effectiveTotalPages) return;

    if (this.customCall) {
      this.pageChange.emit(pPage);
    } else if (this.service) {
      this.service.search.page = pPage;
      this.service.getAll();
    } else {
      this.pageChange.emit(pPage);
    }
  }
}