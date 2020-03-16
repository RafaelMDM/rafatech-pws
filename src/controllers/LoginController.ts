import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserSchema, { User } from '../db/User';
import { successResponse, failureResponse } from '../utils';

class LoginController {
  register(req: Request, res: Response): Response {
    const registrationsAreClosed = process.env.REGISTRATIONS_OPEN !== 'true';

    if (registrationsAreClosed) {
      const report = failureResponse('Server is not currently accepting new registrations');
      return res.status(403).send(report);
    }
    if (!isUser(req.body)) {
      const report = failureResponse('No username/password provided');
      return res.status(400).send(report);
    }

    const newUser = new UserSchema({
      username: req.body.username,
    });
    newUser.password = newUser.generateHash(req.body.password);
    newUser.save().then(user => res.status(201).send(
      successResponse(user)
    )).catch(err => res.status(500).send(
      failureResponse(err)
    ));
  }

  login(req: Request, res: Response): Response {
    if (!isUser(req.body)) {
      const report = failureResponse('No username/password provided');
      return res.status(400).send(report);
    }

    UserSchema.findOne({ username: req.body.username }, (err, user) => {
      if (!user || !user.validatePassword(req.body.password)) {
        const report = failureResponse('Incorrect username or password');
        return res.status(400).send(report);
      }

      const token = jwt.sign({
        username: user.username,
        password: user.password,
      }, process.env.API_SECRET);

      req.session.token = token;
      res.status(200).send(
        successResponse({ token })
      );

      user.lastLogin = new Date();
      user.loggedIn = true;
      user.save();
    });
  }

  refresh(req: Request, res: Response): Response {
    const { token } = req.session;
    if (!token) {
      const report = failureResponse('Session has expired');
      return res.status(400).send(report);
    }

    const report = successResponse({ token });
    res.status(200).send(report);
  }
}

function isUser(object: any): object is User {
  return 'username' in object && 'password' in object;
}

export default new LoginController();