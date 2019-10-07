import { Message } from './types';
import { getRandomMessages } from './__mocks__/message';
import { uniqueId } from 'lib/uniqueId';

export class MessageService {

    static async loadAll(recipientId: string): Promise<Message[]> {
        const { debug } = (window as any).store.getState();
        await new Promise(resolve => setTimeout(resolve, debug.latency));
        if (debug.shouldRequestsFail) {
            throw new Error('Simulated failure');
        }
        return getRandomMessages(recipientId);
    }

    static async send(recipientId: string, text: string): Promise<Message> {
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
            recipientId,
        };
        return message;
    }
}
