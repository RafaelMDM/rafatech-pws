import { Request, Response, NextFunction } from "express";
import { IMessage } from "../db/Message";
import MessageService from "../services/MessageService";

class MessageController {
  async send(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isMessage(req.body))  return next();

      const message = await MessageService.send(req.body);
      return res.status(201).send(message);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const messages = await MessageService.list(req.body.query);

      return res.status(200).send(messages);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
}

function isMessage(object: any): object is IMessage {
  return '_id' in object || (
    'from' in object &&
    'subject' in object &&
    'body' in object
  )
}

export default new MessageController();
