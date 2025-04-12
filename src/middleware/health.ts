import { Request, Response } from 'express';
import { HealthCheck } from '../common/interfaces/health';

export const getHealth = (req: Request, res: Response): void => {
  const health: HealthCheck = {
    status: true,
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(health);
};