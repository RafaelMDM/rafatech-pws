import { Request, Response, NextFunction } from "express";
import { IMessage } from "../db/Message";
import { successResponse, failureResponse } from '../utils';
import MessageService from "../services/MessageService";

class MessageController {
  async send(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isMessage(req.body))  return next();

      const message = await MessageService.send(req.body);
      const report = successResponse(message);
      return res.status(201).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const messages = await MessageService.list(req.body.query);

      const report = successResponse(messages);
      return res.status(200).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }
}

function isMessage(object: any): object is IMessage {
  return 'id' in object || (
    'from' in object &&
    'subject' in object &&
    'body' in object
  )
}

export default new MessageController();
