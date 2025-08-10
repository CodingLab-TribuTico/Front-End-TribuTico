import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { UserFormComponent } from '../../components/user/user-form/user-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../../interfaces';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    UserFormComponent
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  public userService: UserService = inject(UserService);
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addUsersModal') public addUsersModal: any;
  public title: string = 'Usuarios';
  public fb: FormBuilder = inject(FormBuilder);
  @Output() callCustomSearchMethod = new EventEmitter();

  userForm = this.fb.group({
    id: [''],
    identification: ['', [Validators.required, Validators.pattern(/^(\d{9}|\d{12})$/)]],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    lastname2: [''],
    birthDate: ['', Validators.required],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    status: ['', Validators.required],
    password: [''],
    role: ['']
  })

  constructor() {
    this.userService.search.page = 1;
    this.userService.getAll();
  }

  saveUser(user: IUser) {
    this.userService.save(user);
    this.modalService.closeAll();
  }

  callEdition(user: IUser) {
    this.userForm.controls['id'].setValue(user.id ? JSON.stringify(user.id) : '');
    this.userForm.controls['identification'].setValue(user.identification ? user.identification : '');
    this.userForm.controls['name'].setValue(user.name ? user.name : '');
    this.userForm.controls['lastname'].setValue(user.lastname ? user.lastname : '');
    this.userForm.controls['lastname2'].setValue(user.lastname2 ? user.lastname2 : '');
    this.userForm.controls['birthDate'].setValue(user.birthDate ? user.birthDate : '');
    this.userForm.controls['email'].setValue(user.email ? user.email : '');
    this.userForm.controls['status'].setValue(String(user.status));
    this.modalService.displayModal(this.addUsersModal);
  }

  updateUser(user: IUser) {
    this.userService.update(user);
    this.modalService.closeAll();
  }

  search(event: Event) {
    let input = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.userService.search.page = 1;
    this.userService.search.search = input;
    this.userService.getAll();
  }

  cancelUpdate() {
    this.userForm.reset();
    this.modalService.closeAll();
  }
}
