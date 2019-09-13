import { Message } from './types';
import { mockMessages } from './__mocks__/message';

const uniqueId = () => String(Math.random()).split('.').pop()!;

export class MessageService {

    static async loadAll(recipientId: string): Promise<Message[]> {
        const { debug } = (window as any).store.getState();
        await new Promise(resolve => setTimeout(resolve, debug.latency));
        if (debug.shouldRequestsFail) {
            throw new Error('Simulated failure');
        }
        return mockMessages;
    }

    static async send(text: string): Promise<Message> {
        const { debug } = (window as any).store.getState();
        await new Promise(resolve => setTimeout(resolve, debug.latency));
        if (debug.shouldRequestsFail) {
            throw new Error('Simulated failure');
        }
        const message: Message = {
            id: uniqueId(),
            text,
            sent: new Date().toISOString(),
            sender: 'you',
        };
        return message;
    }
}
