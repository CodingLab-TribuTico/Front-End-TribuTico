import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from '../../modal/modal.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ModalComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  public idUser: number | null = Number(JSON.parse(localStorage.getItem('auth_user') || 'null')?.id) || null;
  @Input() title: string = '';
  @Input() users: IUser[] = [];
  @Output() callModalAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callDeleteAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @ViewChild('confirmationModal') public confirmationModal: any;
  public modalService: ModalService = inject(ModalService);
  public selectedUser: IUser | null = null;

  openModal(item: IUser) {
    this.selectedUser = item;
    this.modalService.displayModal(this.confirmationModal);
  }

  hideModal() {
    this.modalService.closeAll();
  }

  deleteUser(id: IUser["id"]) {
    this.hideModal();
    const user = this.users.find(u => u.id === id);
    if (user) {
      this.callDeleteAction.emit(user);
    }
    this.selectedUser = null;
  }
}
