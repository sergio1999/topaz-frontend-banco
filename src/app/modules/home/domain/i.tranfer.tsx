export interface IPayeer {
  document: string;
  name: string;
}

export interface ITransfer {
  value: number;
  date: string;
  currency: string;
  payeer: IPayeer;
}

export interface ITransferListResponse {
  mesage: string;
  transfers: ITransfer[];
}

export interface ITransferRequest {
  value: number;
  currency: string;
  payeerDocument: string;
  transferDate: string;
}

export interface ITransferResponse {
  status: string;
}
