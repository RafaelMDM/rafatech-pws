import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { failureResponse } from '../utils';

const tokenVerifier = Router();

tokenVerifier.all('*', verifyToken);

export default tokenVerifier;

function verifyToken(req: Request, res: Response, next: NextFunction): Response | void {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const acessToken = req.headers['x-access-token'];
  const token = (acessToken instanceof Array) ? acessToken[0] : acessToken;
  if (!token)  return res.status(403).send(failureResponse('No token provided'));

  jwt.verify(token, process.env.API_SECRET, (err, decoded) => {
    if (err)  return res.status(500).send(failureResponse('Failed to authenticate token'));

    next();
  });
}
