import { Request } from 'express';

export interface AuthPayloadI {
  id: number;
  email: string;
}

export interface RequestWithAuthPayloadI extends Request {
  user: AuthPayloadI;
}
