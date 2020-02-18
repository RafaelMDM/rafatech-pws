import Message, { IMessage } from "../db/Message";
import nodemailer from "nodemailer";

type MessageResponse = {
  accepted: string[],
  rejected: string[],
  envelopeTime: number,
  messageTime: number,
  messageSize: number,
  response: string,
  envelope: any,
  messageId: string,
}

class MessageService {
  async send(messageData: IMessage): Promise<MessageResponse> {
    const {
      from,
      subject,
      body,
    } = messageData;
    const html = `&lt;&lt; Sent by: ${from} &gt;&gt;<br><br>${body}`;

    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });
    const mailOptions = {
      from,
      to: process.env.MAIL_ADDRESS,
      subject,
      html,
    };

    const response: MessageResponse = await transporter.sendMail(mailOptions);
    //? If there's at least one accepted recepient
    if (response.accepted[0]) {
      await Message.create({
        from,
        subject,
        body,
        completedAt: new Date(),
      });
    }
    return response;
  }

  async list(query?: string): Promise<IMessage[]> {
    const options = (query) ? {
      from: new RegExp(query, 'i'),
    } : {};
    const messages = await Message.find(options);

    return messages;
  }
}

export default new MessageService();
