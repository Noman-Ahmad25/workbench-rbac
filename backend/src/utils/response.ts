// backend/src/utils/response.ts
import { type Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, status: number = 200) => {
  return res.status(status).json({ success: true, data });
};

export const sendError = (res: Response, status: number, error: string) => {
  return res.status(status).json({ success: false, error });
};