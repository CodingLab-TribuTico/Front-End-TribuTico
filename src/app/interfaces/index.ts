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
  status?: string;
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
export interface IDetailInvoice {
  cabys?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  discount?: number;
  tax?: number;
  taxAmount?: number;
  category?: string;
  total?: number;
  description?: string;

}

export interface IInvoiceUser {
  id?: number;
  name?: string;
  lastName?: string;
  email?: string;
  identification?: string;
}

export interface IManualInvoice {
  id?: number;
  type?: string;
  consecutive?: string;
  key?: string;
  issueDate?: string;
  details?: IDetailInvoice[];
  receiver?: IInvoiceUser;  // Usuario que recibe la factura
  issuer?: IInvoiceUser;    // Usuario que emite la factura
  users?: IUser;
}

export interface IIsrSimulation {
  id?: number;

  // I. Datos generales
  simulationPeriod: string;
  simulationName: string;
  simulationIdentification: string;

  // I. Activos y pasivos
  currentAssets: number;
  equityInvestments: number;
  inventory: number;
  netFixedAssets: number;
  totalNetAssets: number;
  totalLiabilities: number;
  netEquity: number;

  // II. Ingresos y gastos
  salesRevenue: number;
  professionalFees: number;
  commissions: number;
  interestsAndYields: number;
  dividendsAndShares: number;
  rents: number;
  otherIncome: number;
  nonTaxableIncome: number;
  grossIncomeTotal: number;

  // III. Costos, gastos y deducciones
  initialInventory: number;
  purchases: number;
  finalInventory: number;
  costOfGoodsSold: number;
  financialExpenses: number;
  administrativeExpenses: number;
  depreciationAndAmortization: number;
  pensionContributions: number;
  otherAllowableDeductions: number;
  totalAllowableDeductions: number;

  // IV. Base imponible
  netTaxableIncome: number;
  nonTaxableSalaryAmount: number;
  incomeTax: number;
  freeTradeZoneExemption: number;
  otherExemptions: number;
  netIncomeTaxAfterExemptions: number;

  // V. Créditos
  familyCredit: number;
  otherCredits: number;
  periodTax: number;
  twoPercentWithholdings: number;
  otherWithholdings: number;
  partialPayments: number;
  totalNetTax: number;

  // VI. Liquidación deuda tributaria
  interests: number;
  totalTaxDebt: number;
  requestedCompensation: number;
  totalDebtToPay: number;
}
