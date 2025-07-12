export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
  message: string,
  meta: T;
}

export interface IUser {
  id?: number;
  identification?: string;
  name?: string;
  lastname?: string;
  lastname2?: string;
  birthDate?: string;
  email?: string;
  password?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole

}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRoleType {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN'
}

export interface IRole {
  createdAt?: string;
  description?: string;
  id?: number;
  name?: string;
  updatedAt?: string;
}

export interface ISearch {
  query?: string;
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  search?: string;
}
export interface IDetailsBill {
  id?: number;
  detailCode: number;
  detailDescription: string;
  quantity: number;
  unitPrice: number;
  unit: number;
  tax: number;
  taxAmount: number;
  total: number;
  electronicBillId: number;
}

export interface IManualBill {
  id?: number;
  consecutive?: number;
  code?: number;
  issueDate?: string;
  details?: IDetailsBill[];
  users?: IUser;
}