import mongoose from 'mongoose';
import Message, { IMessage } from "@schemas/Message";
import MessageService from './MessageService';
import dotenv from "dotenv-safe";

describe('Message Service', () => {
  jest.setTimeout(20000);

  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Message.deleteMany({});
  });

  it('should send an email', async () => {
    dotenv.config();
    const ms = new MessageService();
    const reqBody: IMessage = {
      from: 'Teste &lt;teste@teste.com&gt;',
      subject: 'Testando envio de email!',
      body: 'Isto é um teste.<br><strong>TESTANDO!</strong>',
    };
    const response = await ms.send(reqBody);
    const messages = await ms.list();

    expect(response.accepted[0]).toEqual(process.env.MAIL_ADDRESS);
    expect(messages).toHaveLength(1);
  });

  it('should be able to filter emails', async () => {
    dotenv.config();
    const ms = new MessageService();
    const reqBody: IMessage = {
      from: 'Teste &lt;teste@teste.com&gt;',
      subject: 'Testando envio de email!',
      body: 'Isto é um teste.<br><strong>TESTANDO!</strong>',
    };
    await ms.send(reqBody);
    const correctFilter = await ms.list('teste');
    const wrongFilter = await ms.list('dontfindthis');

    expect(correctFilter).toHaveLength(1);
    expect(wrongFilter).toHaveLength(0);
  });
});
