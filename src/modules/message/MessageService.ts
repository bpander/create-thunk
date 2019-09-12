import { Message } from './types';
import { mockMessages } from './__mocks__/message';

const uniqueId = () => String(Math.random()).split('.').pop()!;

export class MessageService {

  static async loadAll(recipientId: string): Promise<Message[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMessages;
  }

  static async send(text: string): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const message: Message = {
      id: uniqueId(),
      text,
      sent: new Date().toISOString(),
      sender: 'you',
    };
    return message;
  }
}
